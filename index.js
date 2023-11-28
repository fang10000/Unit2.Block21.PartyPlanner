const COHORT = "2310-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    parties: [],
  };

  const partyList = document.querySelector("#parties"); 

  const addEventForm = document.querySelector("#addEvent");
  addEventForm.addEventListener("submit", addEvent);

  async function render() {
    await getParties();
    renderParties();
  }
  render();

  async function getParties () {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No parties.</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.dataset.partyId = party.id;
    li.innerHTML = `
      <h2>${party.name}</h2>
      <p> ID: ${party.id}</p>
      <p>Description: ${party.description}</p>
      <p>Date & Time: ${party.date}</p>
      <p>Location: ${party.location}</p>
      <button class="deleteBtn">Delete</button>
    `;
    return li;
  });

  partyList.replaceChildren(...partyCards);

  const deleteButtons = document.querySelectorAll('.deleteBtn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteItem);
  });

}

document.addEventListener('DOMContentLoaded', function() {
  renderParties();
});


async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: addEventForm.date.value,
        location: addEventForm.location.value
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteItem(event) {
  const partyId = event.target.parentElement.dataset.partyId;

  try {
    const deleteResponse = await fetch(`${API_URL}/${partyId}`, {
      method: "DELETE",
    });

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete event");
    }

    // Update state by removing the deleted party
    state.parties = state.parties.filter(party => party.id !== partyId);

    renderParties();
  } catch (error) {
    console.error(error);
  }
}
