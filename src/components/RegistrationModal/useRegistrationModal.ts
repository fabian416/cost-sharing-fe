import { useState, FormEvent } from 'react'; // Asegúrate de incluir FormEvent aquí
import axios from 'axios';

const useRegistrationModal = (onRequestClose: () => void) => {
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/users/register', {
                alias,
                email
            });

            if (response.status === 200) {
                onRequestClose(); // Cerrar modal si el registro es exitoso
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return {
        handleSubmit,
        alias,
        setAlias,
        email,
        setEmail
    };
}

export default useRegistrationModal;
