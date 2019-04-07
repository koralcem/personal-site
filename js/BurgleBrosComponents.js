class BurgleRoom extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })

    const roomDiv = document.createElement('div')

    const decrementRoomCount = function (mouseEvent) {
      const roomDiv = mouseEvent.currentTarget
      const remaining = parseInt(roomDiv.firstChild.innerText) - 1
      roomDiv.firstChild.innerText = remaining
      if (remaining === 0) {
        roomDiv.removeEventListener('click', decrementRoomCount)
        roomDiv.classList.add('out-of-game')
      }
    }
    roomDiv.addEventListener('click', decrementRoomCount)

    shadow.appendChild(roomDiv)

    const styleNode = document.createElement('style')
    styleNode.textContent = `
    .safe {
      background-color: rgb(6, 184, 0);
    }

    .stair {
      background-color: rgb(169, 169, 169);
    }

    .beneficial {
      background-color: rgb(58, 211, 214);
    }

    .special-movement {
      background-color: rgb(107, 142, 35);
    }

    .computer {
      background-color: rgb(253, 196, 252);
    }

    .alarm {
      background-color: rgb(252, 64, 64);
    }

    .impediment {
      background-color: rgb(222, 176, 5);
    }

    .open-area {
      background-color: rgb(245, 242, 13);
    }

    .out-of-game {
      background-color: transparent;
      text-decoration: line-through;
    }

    .room {
      display: flex;
      align-items: center;
      height: 45px;
    }

    .room > div:first-child {
      padding: 0 10px;
    }
    `
    shadow.appendChild(styleNode)
  }

  connectedCallback() {
    if (!this.hasAttribute('count')) {
      throw new Error('Using a room without a count attribute is not supported')
    }

    if (!this.hasAttribute('name')) {
      throw new Error('Using a room without a name attribute is not supported')
    }

    if (!this.hasAttribute('type')) {
      throw new Error('Using a room without a type attribute is not supported')
    }

    const roomCountDiv = document.createElement('div')
    roomCountDiv.innerHTML = this.getAttribute('count')

    const roomNameDiv = document.createElement('div')
    roomNameDiv.innerHTML = this.getAttribute('name')

    const roomDiv = this.shadowRoot.querySelector('div')
    roomDiv.appendChild(roomCountDiv)
    roomDiv.appendChild(roomNameDiv)
    roomDiv.className = `room ${this.getAttribute('type')}`
  }
}
window.customElements.define('burgle-room', BurgleRoom)


class BurgleColumn extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    const column = document.createElement('div')
    column.className = 'column'
    shadow.appendChild(column)

    const styleNode = document.createElement('style')
    styleNode.textContent = `
    :host {
      width: 50%;
    }

    .column {
      display: flex column;
    }
    `
    shadow.appendChild(styleNode)
  }

  set rooms (rooms) {  // Expects an array of RoomTile instances
    rooms.forEach(room => {
      const roomElement = document.createElement('burgle-room')
      roomElement.setAttribute('count', room.count)
      roomElement.setAttribute('name', room.name)
      roomElement.setAttribute('type', room.type)
      this.shadowRoot.querySelector('div').appendChild(roomElement)
    });
  }
}
window.customElements.define('burgle-column', BurgleColumn)


class RoomTile {
  constructor(name, count, type) {
    this.name = name
    this.count = count    // Total occurrences of this tile in the game
    this.type = type
  }
}


class BurgleCard extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    const card = document.createElement('div')
    card.className = 'card'
    shadow.appendChild(card)

    const rooms = [
      new RoomTile('Safe', 3, 'safe'),
      new RoomTile('Stairs', 3, 'stair'),
      new RoomTile('Walkway', 3, 'beneficial'),
      new RoomTile('Laboratory', 2, 'beneficial'),
      new RoomTile('Lavatory', 1, 'beneficial'),
      new RoomTile('Service Duct', 2, 'special-movement'),
      new RoomTile('Secret Door', 2, 'special-movement'),
      new RoomTile('Computer', 3, 'computer'),
      new RoomTile('Camera', 4, 'alarm'),
      new RoomTile('Laser', 3, 'alarm'),
      new RoomTile('Motion', 3, 'alarm'),
      new RoomTile('Detector', 3, 'alarm'),
      new RoomTile('Fingerprint', 3, 'alarm'),
      new RoomTile('Thermo', 3, 'alarm'),
      new RoomTile('Keypad', 3, 'impediment'),
      new RoomTile('Deadbolt', 3, 'impediment'),
      new RoomTile('Foyer', 2, 'open-area'),
      new RoomTile('Atrium', 2, 'open-area'),
    ]

    const numColumns = 2
    for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
      const stride = rooms.length / numColumns
      const sliceStart = columnIndex * stride
      const sliceEnd = (columnIndex + 1) * stride
      const columnElement = document.createElement('burgle-column')
      columnElement.rooms = rooms.slice(sliceStart, sliceEnd)
      card.appendChild(columnElement)
    }

    const styleNode = document.createElement('style')
    styleNode.textContent = `
    :host {
      display: flex;
      justify-content: center;
    }
    .card {
      display: flex;
      justify-content: center;
      width: 450px;
    }
    `
    shadow.appendChild(styleNode)
  }
}
window.customElements.define('burgle-card', BurgleCard)
