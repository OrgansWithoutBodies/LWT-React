# LWT-React

LWT-React is a React port for the classic PHP language-learning program Learning With Texts (https://learning-with-texts.sourceforge.io/).

This project was started before learning about (Lute)[https://github.com/jzohrab/lute-v3] - though this is much more frontend-focused & ideally completely independent of backend implementation details.

## Features

On top of (incompletely) matching features of the original LWT app, LWT-React also allows:

- Electron app
- RxJS Observable Patterns - lightning fast updates
- SPA - no reload necessary
- Switchable backend [localStorage, Local SQLite (Electron-only), REST (TODO)] - for example, a SQLite persistence backend allows to create a fully encapsulated bundle which works on, for example, an offline tablet.

## Build Options

LWT-React allows for flags during buildtime in order to customize build. Flags include:

- `VITE_LWT_PERSIST=LOCALSTORAGE|SQLITE|REST` - persistence method, ie data storage backend

Build & dev targets are specified in the format `yarn [dev|build]:[?electron]:[local|sqlite|rest]`

## TODOs

- OpenAPI for REST
- Build to Android/IOS
- Unit & Integ. Tests before significant further dev
- Text Reader app not fully done
- Text parsing not good yet
- Annotated Text
- Term tester
- Backup/Restore not working yet
- Vite Env Vars not working in electron
- Audio not implemented
- No REST Backend yet
- SQLite Backend incomplete
- Lute intercompatibility
- Mobile Mode - incl Tablet Mode
- Bits and bobs

## No plans on reimplimentation

- Copying over "Mobile Mode" - instead make new mobile mode with modern design & libraries
- Tableset feature - perhaps will include some sketches of user auth, which would then be handled by REST api server.
