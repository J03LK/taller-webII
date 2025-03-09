// Script para el panel de usuario

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const logoutBtn = document.getElementById('logout-btn');
    const complaintForm = document.getElementById('complaint-form');
    
    // Manejador para el botón de cerrar sesión
    logoutBtn.addEventListener('click', function() {
        if (confirm('¿Está seguro que desea cerrar la sesión?')) {
            // Aquí iría la lógica de cierre de sesión
            alert('Sesión cerrada correctamente');
            // Redirección a la página de login (simulada)
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirección simulada
            }, 1000);
        }
    });
    
    // Manejador para el envío del formulario
    if (complaintForm) {
        complaintForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica del formulario
            const tipo = document.getElementById('tipo').value;
            const ubicacion = document.getElementById('ubicacion').value;
            const descripcion = document.getElementById('descripcion').value;
            
            if (!tipo || !ubicacion || !descripcion) {
                showNotification('Por favor complete todos los campos obligatorios', 'error');
                return;
            }
            
            // Simulación de envío exitoso (aquí iría la lógica de envío al servidor)
            showNotification('Denuncia enviada exitosamente', 'success');
            
            // Animación de éxito
            const formContainer = document.querySelector('.new-complaint');
            formContainer.classList.add('form-success');
            
            // Limpiar formulario después de envío exitoso
            setTimeout(() => {
                complaintForm.reset();
                formContainer.classList.remove('form-success');
            }, 1500);
        });
    }
    
    // Función para mostrar notificaciones
    function showNotification(message, type) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Añadir al DOM
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Eliminar después de un tiempo
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
    
    // Añadir estilos para notificaciones dinámicamente
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification.success {
            background-color: #4CAF50;
        }
        .notification.error {
            background-color: #F44336;
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);
    
    // Implementación de la funcionalidad de carga de archivos
    const fileInput = document.getElementById('evidencia');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : 'Ningún archivo seleccionado';
            const fileLabel = document.querySelector('label[for="evidencia"]');
            fileLabel.setAttribute('data-file', fileName);
        });
    }
    
    // Cambiar entre secciones del panel (simulado)
    const menuItems = document.querySelectorAll('.sidebar a');
    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remover clase activa de todos los elementos
                menuItems.forEach(mi => mi.parentElement.classList.remove('active'));
                
                // Añadir clase activa al elemento clickeado
                this.parentElement.classList.add('active');
                
                // Aquí iría la lógica para cargar diferentes secciones
                const section = this.textContent.trim();
                showNotification(`Sección "${section}" cargada`, 'success');
            });
        });
    }
});