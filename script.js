async function loadGuests() {
  // Fetch CSV file
  const response = await fetch('./guestsFinal.csv');
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
      const fullName = `${guest.lastName}, ${guest.firstName}`;

      guestClone.querySelector('.guest-name')
        .textContent = fullName;

      guestClone.querySelector('.guest-table')
        .textContent = `${guest.table}`;

      // Store a lowercase, searchable version of the name on the row itself
      const guestRow = guestClone.querySelector('.list-group-item');
      guestRow.dataset.searchName = fullName.toLowerCase();

      guestList.appendChild(guestClone);
    }

    container.appendChild(sectionClone);
  }
}

function setupSearch() {
  const searchInput = document.getElementById('guest-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    // Every rendered letter section
    const sections = document.querySelectorAll('#guest-groups section');

    sections.forEach((section) => {
      let visibleCount = 0;

      const rows = section.querySelectorAll('.list-group-item');

      rows.forEach((row) => {
        const matches = row.dataset.searchName.includes(query);
        row.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
      });

      // Hide the whole letter section if no guests in it match
      section.style.display = visibleCount > 0 ? '' : 'none';
    });
  });
}

async function init() {
  const groupedGuests = await loadGuests();

  renderGuests(groupedGuests);
  setupSearch();
}

init();