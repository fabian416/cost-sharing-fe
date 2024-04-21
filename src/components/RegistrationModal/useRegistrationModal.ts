import { useState } from 'react';

const useRegistrationModal = (onRequestClose: () => void, onRegistrationSuccess: () => void) => {
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        // Aquí simulas el registro. En producción, harías una llamada a la API.
        setTimeout(() => {
            // Simulando una respuesta exitosa de la API
            localStorage.setItem('userAlias', alias);
            if (email) localStorage.setItem('userEmail', email);
            onRegistrationSuccess();
            onRequestClose();
            setIsSubmitting(false);
        }, 1000);

        // Gestión de errores simulada
        setError(''); // Limpiar errores anteriores
    };

    return {
        alias,
        setAlias,
        email,
        setEmail,
        handleSubmit,
        isSubmitting,
        error
    };
};

export default useRegistrationModal;
