async function loadGuests() {
  // Fetch CSV file
  const response = await fetch('./guests.csv');
  const csvText = await response.text();

  // Split into lines
  const lines = csvText.trim().split('\n');

  // Remove header row
  lines.shift();

  // Grouped result
  const groupedGuests = {};

  for (const line of lines) {
    const [name, table] = line.split(',');

    // First letter of last name
    const firstLetter = name.charAt(0).toUpperCase();

    // Created a letter group if it doesn't already exist
    if (!groupedGuests[firstLetter]) {
      groupedGuests[firstLetter] = [];
    }

    // Add the name to the letter group
    groupedGuests[firstLetter].push({
      name: name.trim(),
      table: Number(table)
    });
  }

  return groupedGuests;
}

function renderGuests(groupedGuests) {

  const container =
    document.getElementById('guest-groups');

  const letterTemplate =
    document.getElementById('letter-template');

  const guestTemplate =
    document.getElementById('guest-template');

  const letters =
    Object.keys(groupedGuests).sort();

  for (const letter of letters) {

    const sectionClone =
      letterTemplate.content.cloneNode(true);

    sectionClone.querySelector('.letter-heading')
      .textContent = letter;

    const guestList =
      sectionClone.querySelector('.guest-list');

    groupedGuests[letter]
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const guest of groupedGuests[letter]) {

      const guestClone =
        guestTemplate.content.cloneNode(true);

      guestClone.querySelector('.guest-name')
        .textContent = guest.name;

      guestClone.querySelector('.guest-table')
        .textContent = `${guest.table}`;

      guestList.appendChild(guestClone);
    }

    container.appendChild(sectionClone);
  }
}

async function init() {
  const groupedGuests = await loadGuests();

  renderGuests(groupedGuests);
}

init();