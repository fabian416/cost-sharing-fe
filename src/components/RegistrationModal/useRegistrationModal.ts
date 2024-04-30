import { useState, useEffect } from 'react';

const useRegistrationModal = (onRequestClose: () => void, onRegistrationSuccess: () => void) => {
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    // Inicializar isRegistered desde localStorage
    const [isRegistered, setIsRegistered] = useState(() => localStorage.getItem('isRegistered') === 'true');

    useEffect(() => {
        // Actualizar localStorage cuando isRegistered cambia
        localStorage.setItem('isRegistered', isRegistered.toString()); // Guardar estado en localStorage
    }, [isRegistered]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        setTimeout(() => {
            localStorage.setItem('userAlias', alias);
            if (email) localStorage.setItem('userEmail', email);
            setIsRegistered(true);  // Marca al usuario como registrado
            onRegistrationSuccess();  // Maneja la redirección o lo que necesites hacer post-registro
            onRequestClose();  // Cierra el modal
            setIsSubmitting(false);
        }, 1000);
    
        setError(''); // Limpiar errores anteriores
    };
    
    const handleCloseModal = () => {
        if (!isRegistered) {  // Permite cerrar el modal solo si el usuario no está registrado
            setError('Please complete the registration to proceed.');  // Muestra un mensaje si intentan cerrar el modal sin completar el registro
        }
        onRequestClose();  // Close the modal independently of the register
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
