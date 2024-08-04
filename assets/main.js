// Definir Symbols para propiedades privadas
const salario = Symbol('salario');
const datosPersonales = Symbol('datosPersonales');

// Clase Empleado con propiedades privadas
class Empleado {
    constructor(nombre, salarioInicial, datosPersonalesIniciales) {
        this.nombre = nombre;
        this[salario] = salarioInicial;
        this[datosPersonales] = datosPersonalesIniciales;
    }
}

// Función para crear un proxy de empleado con control de acceso basado en roles
function crearProxyEmpleado(empleado, rol) {
    return new Proxy(empleado, {
        get(target, prop) {
            if (prop === salario || prop === datosPersonales) {
                if (rol === 'gerente') {
                    return Reflect.get(target, prop);
                } else {
                    console.log(`Acceso denegado a la propiedad ${String(prop)}`);
                    return 'Acceso denegado';
                }
            }
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            if (prop === salario || prop === datosPersonales) {
                if (rol === 'gerente') {
                    return Reflect.set(target, prop, value);
                } else {
                    console.log(`Acceso denegado para modificar la propiedad ${String(prop)}`);
                    return false;
                }
            }
            return Reflect.set(target, prop, value);
        },
        has(target, prop) {
            if (prop === salario || prop === datosPersonales) {
                if (rol === 'gerente') {
                    return Reflect.has(target, prop);
                } else {
                    return false;
                }
            }
            return Reflect.has(target, prop);
        }
    });
}

// Crear un empleado
const empleado1 = new Empleado('Juan Pérez', 50000, { direccion: 'Calle Falsa 123', telefono: '555-1234' });

// Crear proxies con diferentes roles
const proxyGerente = crearProxyEmpleado(empleado1, 'gerente');
const proxyEmpleado = crearProxyEmpleado(empleado1, 'empleado');

// Intentar acceder y modificar las propiedades desde diferentes roles
console.log('--- Gerente ---');
console.log('Nombre:', proxyGerente.nombre);
console.log('Salario:', proxyGerente[salario]);
console.log('Datos Personales:', proxyGerente[datosPersonales]);
proxyGerente[salario] = 55000;
console.log('Nuevo Salario:', proxyGerente[salario]);

console.log('--- Empleado ---');
console.log('Nombre:', proxyEmpleado.nombre);
console.log('Salario:', proxyEmpleado[salario]);
console.log('Datos Personales:', proxyEmpleado[datosPersonales]);
proxyEmpleado[salario] = 60000;
console.log('Nuevo Salario:', proxyEmpleado[salario]);

// Verificar existencia de propiedades
console.log('--- Verificación de existencia de propiedades ---');
console.log('Gerente puede verificar salario:', Reflect.has(proxyGerente, salario));
console.log('Empleado puede verificar salario:', Reflect.has(proxyEmpleado, salario));
