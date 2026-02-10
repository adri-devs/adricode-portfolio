# adricode Portfolio

Portfolio personal desarrollado con React, Vite y Tailwind CSS.

## Características

- Vite para desarrollo rápido
- React 18
- Tailwind CSS
- Modo oscuro/claro
- Formulario de contacto con Cloudflare Turnstile

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/adri-devs/adricode-portfolio.git
cd adricode-portfolio
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` y añade tus credenciales:
- `VITE_TURNSTILE_SITE_KEY`: Tu site key de Cloudflare Turnstile
- `VITE_API_URL`: URL de tu API de contacto

## Uso
```bash
npm run dev
```

### Para producción
```bash
npm run build
```

## Licencia

Este proyecto es de uso personal. Si quieres usar parte del código, por favor dame crédito.

**Adrián Pérez**
- GitHub: [@adri-devs](https://github.com/adri-devs)
- LinkedIn: [adrian-perez-](https://www.linkedin.com/in/adrian-perez-/)
- Web: [adricode.com](https://adricode.com)
