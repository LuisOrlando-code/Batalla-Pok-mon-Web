# ⚔️ Batalla Pokémon Web

Una aplicación web de batalla Pokémon por turnos desarrollada con **HTML, CSS y JavaScript puro**. El jugador elige su Pokémon favorito y se enfrenta contra un oponente aleatorio controlado por la CPU, usando datos reales de la **PokéAPI**.

---

## 🚀 Características

- Búsqueda de cualquier Pokémon por nombre
- CPU elige un Pokémon aleatorio de la Gen 1
- Sistema de turnos: jugador ataca, CPU contraataca
- Daño calculado con stats reales (ataque, defensa, HP)
- Barras de HP animadas con colores (verde → amarillo → rojo)
- Sprites y datos en tiempo real desde PokéAPI
- Animaciones de golpe y derrota
- Sin instalación, sin API key

---

## 📁 Estructura del proyecto

```
batalla-pokemon/
├── index.html     ← Estructura principal
├── style.css      ← Estilos y animaciones
├── batalla.js     ← Lógica de combate
├── app.js         ← Control de pantallas y flujo
└── README.md
```

---

## ▶️ Cómo usar

1. Descarga o clona el repositorio
2. Abre `index.html` en tu navegador
3. Escribe el nombre de tu Pokémon y presiona **Buscar**
4. Presiona **¡A Batallar!**
5. Presiona **⚡ ATACAR** en cada turno

No necesita servidor ni instalación. Funciona directo en el navegador.

---

## 🛠️ Tecnologías

- HTML5
- CSS3 (animaciones, variables CSS)
- JavaScript ES6+
- [PokéAPI](https://pokeapi.co/) — gratuita, sin registro

---

## 📡 API utilizada

```
https://pokeapi.co/api/v2/pokemon/{nombre}
```

No requiere API key ni registro.

---

## ⚙️ Fórmula de daño

```js
daño = floor((ataque + sp.ataque) / defensa * 20) + 5 + varianza(-5 a +5)
```

---

## 🎮 Demo

![demo1](demo1.png)
![demo2](demo2.png)

## 👤 Autor

Luis Orlando
