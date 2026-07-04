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
    if (!line.trim()) continue;

    // Only care about the first three columns: Last Name, First Name, Table/Row
    const parts = line.split(',');
    const [lastName, firstName, table] = parts;

    const cleanLast = (lastName || '').trim();
    const cleanFirst = (firstName || '').trim();

    // Group by first letter of LAST name
    const firstLetter = cleanLast.charAt(0).toUpperCase();

    if (!groupedGuests[firstLetter]) {
      groupedGuests[firstLetter] = [];
    }

    groupedGuests[firstLetter].push({
      lastName: cleanLast,
      firstName: cleanFirst,
      table: (table || '').trim()
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

    // Sort by last name, then first name
    groupedGuests[letter]
      .sort((a, b) => {
        const lastCompare = a.lastName.localeCompare(b.lastName);
        if (lastCompare !== 0) return lastCompare;
        return a.firstName.localeCompare(b.firstName);
      });

    for (const guest of groupedGuests[letter]) {

      const guestClone =
        guestTemplate.content.cloneNode(true);

      // Display as "Last Name, First Name"
      guestClone.querySelector('.guest-name')
        .textContent = `${guest.lastName}, ${guest.firstName}`;

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