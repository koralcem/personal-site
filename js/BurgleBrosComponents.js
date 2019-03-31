class RoomTile {
  constructor(name, count, type) {
    this.name = name
    this.count = count    // Total occurrences of this tile in the game
    this.type = type
  }
}

const decrementRoomCount = function (mouseEvent) {
  const roomRow = mouseEvent.currentTarget
  const remaining = parseInt(roomRow.lastChild.innerText) - 1
  roomRow.lastChild.innerText = remaining
  if (remaining === 0) {
    roomRow.removeEventListener('click', decrementRoomCount)
    roomRow.className = 'out-of-game'
  }
}

class BurgleTable extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })

    const tableColumns = [
      [
        new RoomTile('Safe', 3, 'safe'),
        new RoomTile('Stairs', 3, 'stair'),
        new RoomTile('Walkway', 3, 'beneficial'),
        new RoomTile('Laboratory', 2, 'beneficial'),
        new RoomTile('Lavatory', 1, 'beneficial'),
        new RoomTile('Service Duct', 2, 'special-movement'),
        new RoomTile('Secret Door', 2, 'special-movement'),
        new RoomTile('Computer', 3, 'computer'),
        new RoomTile('Camera', 4, 'alarm'),
      ],
      [
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
    ]

    tableColumns.map((columnArray) => {
      const table = document.createElement('table')
      columnArray.map((room) => {
        const row = document.createElement('tr')
        row.innerHTML = `<td>${room.name}</td><td>${room.count}</td>`
        row.className = room.type
        row.addEventListener('click', decrementRoomCount)
        table.appendChild(row)
      })
      shadow.appendChild(table)
    })

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

    table {
      border-collapse: collapse;
      display: inline;
    }

    td {
      padding: 5px;
    }
    `
    shadow.appendChild(styleNode)
  }
}

window.customElements.define('burgle-table', BurgleTable)
