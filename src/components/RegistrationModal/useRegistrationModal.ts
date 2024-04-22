import { useState } from 'react';

const useRegistrationModal = (onRequestClose: () => void, onRegistrationSuccess: () => void) => {
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false); 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        // Simula el registro
        setTimeout(() => {
            // Simulando una respuesta exitosa de la API
            localStorage.setItem('userAlias', alias);
            if (email) localStorage.setItem('userEmail', email);
            setIsRegistered(true);  // Marca al usuario como registrado solo si el formulario es válido
            onRegistrationSuccess();  // Maneja la redirección o lo que necesites hacer post-registro
            onRequestClose();  // Cierra el modal
            setIsSubmitting(false);
        }, 1000);
    
        // Gestión de errores
        setError(''); // Limpiar errores anteriores
    };
    
    const handleCloseModal = () => {
        if (isRegistered) {  // Cierra el modal solo si el usuario está registrado
            onRequestClose();
        } else {
            setError('Please complete the registration to proceed.');  // Muestra un mensaje si intentan cerrar el modal sin completar el registro
        }
    };
    
    return {
        handleCloseModal,
        alias,
        setAlias,
        email,
        setEmail,
        handleSubmit,
        isSubmitting,
        error,
        isRegistered,
        setIsRegistered,
    };
};

export default useRegistrationModal;
