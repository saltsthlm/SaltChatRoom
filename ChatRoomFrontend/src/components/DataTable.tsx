import React, { useEffect, useState } from 'react'
import User from '../models/User';

function validateWithPattern(text: string, pattern?: string) {
    if (pattern) {
        return text.match(pattern) != undefined;
    }
    return true;
}

interface StringDataCellProps {
    value: string,
    onChange: (value: string) => void;
    validationPattern?: string,
    placeholder?: string,
    validationError?: string,
    disabled?: boolean
}

export function StringDataCell({ value, onChange, validationPattern, validationError, placeholder, disabled }: StringDataCellProps) {
    const [inputIsValid, setInputIsValid] = useState(validateWithPattern(value, validationPattern));

    validationError ??= "(Sorry, something is wrong with the input!)";
    placeholder ??= "Enter text...";
    disabled ??= false;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const currentInputIsValid = validateWithPattern(e.target.value, validationPattern);
        const currentValue = e.target.value;
        setInputIsValid(currentInputIsValid);
        onChange(currentValue);
    }

    const inputElement = <input
        type="text"
        value={value}
        required
        placeholder={placeholder}
        onChange={(e) => handleChange(e)}
        disabled={disabled}
        className={`input input-bordered w-full max-w-xs ${!inputIsValid ? "input-error" : "input-success"}`}>
    </ input >

    return inputElement;
}

interface UserRowProps {
    user: User,
    handleChanges: ((newValue: string) => void)[]
}

export function UserRow({ user, handleChanges }: UserRowProps) {
    return (
        <tr key={user.id}>
            <td key={"id"}>
                <StringDataCell value={user.id} disabled={true} onChange={handleChanges[0]}></StringDataCell>
            </td>
            <td key={"alias"}>
                <StringDataCell value={user.alias} onChange={handleChanges[1]}></StringDataCell>
            </td>
            <td key={"password"}>
                <StringDataCell value={user.password} onChange={handleChanges[2]}></StringDataCell>
            </td>
        </tr>
    );
}

export function UserTable() {
    const [users, setUsers] = useState<User[]>([{
        id: "1",
        alias: "Adam",
        password: "apa",
    },
    {
        id: "2",
        alias: "Bertha",
        password: "***-",
    }
    ]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            const url = "http://localhost:5055/api/Users";
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json() as User[];
                setUsers(json);
                console.log(json);
            } catch (error) {
                console.error((error as Error).message);
            }
        }
        fetchAllUsers();
    }, []);

    const reconstructUser = (user: User, key: string, value: string): User | undefined => {
        switch (key) {
            case "id": return { ...user, id: value };
            case "alias": return { ...user, alias: value };
            case "password": return { ...user, password: value };
        }
    }

    const handleChange = (key: string, id: string) => {
        return (newValue: string) => {
            const user = users.find(user => user.id == id);
            if (user == undefined) {
                throw new Error(`User id ${id} cannot be found in state`);
            }
            const userIndex = users.indexOf(user);
            const newUser = reconstructUser(user, key, newValue);
            const newUsers = [...users.slice(0, userIndex), newUser!, ...users.slice(userIndex + 1)];
            setUsers(newUsers);
        };
    }

    if (users.length == 0) {
        return <h2>No users, sorry!</h2>
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            {Object.keys(users[0]).map((name) => (<th key={name}>{name}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            const userEntries = Object.entries(user);
                            return (<UserRow
                                key={user.id}
                                user={user}
                                handleChanges={userEntries.map(([key]) => handleChange(key, users[index].id))}>
                            </UserRow>)
                        })
                        }
                    </tbody>
                </table>
            </div>
            <p>{JSON.stringify(users)}</p>
        </>
    )
}