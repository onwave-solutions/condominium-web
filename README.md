# Condominium Web

Web app para aplicacion de condominios Onwave

Esta aplicación utiliza las siguientes librerias:

- React 16.X
- Typescript 3.X
- Redux/React Redux
- Axios

## Quick Start

Para correr este proyecto necesita clonar el repositorio e instalar las dependencias.

```sh
git clone git@github.com:OnWaveSolutions/condominium-web.git 
cd condominium-web
yarn
```

Luego verificar que las variables de entornos necesarias estan en el documentio `.env`

```sh
REACT_APP_region=us-west-2
REACT_APP_userPoolId=us-west-2_otgosYwhN
REACT_APP_userPoolWebClientId=
REACT_APP_bucket_name=
REACT_APP_access_key=
REACT_APP_secret_key=
```

```sh
yarn start
```

## Arquitectura

El proyecto utiliza atomic design [https://andela.com/insights/structuring-your-react-application-atomic-design-principles/] para la distribución de carpetas de componentes, para las vistas o modulos cada una esta separada dentro de la carpeta de `src/modules` 