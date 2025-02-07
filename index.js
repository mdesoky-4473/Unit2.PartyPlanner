//cohort
const COHORT = "2411-FSA-ET-WEB-PT-md";
// API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

/**
 //  👉 STEP 1: Create an object called state that holds an array for event objects
 */
const state = {
  events: [],
};


//👉 STEP 2: render all events on the page
const renderAllEvents = () => {
    const eventsContainer = document.getElementById("events-container");
    const eventList = state.events;
  
    if (!eventList || eventList.length === 0) {
      eventsContainer.innerHTML = "<h3>No events found</h3>";
      return;
    }
  
    //resets html of all eventsContainer
    eventsContainer.innerHTML = "";
  
    //creates a card for each event
    eventList.forEach((evt) => {
      const eventElement = document.createElement("div");
      eventElement.classList.add("event-card");
      eventElement.innerHTML = `
              <h4>${evt.name}</h4>
              <p>${evt.description}</p>
              <p>${evt.date}</p>
              <p>${evt.location}</p>
              <button class="delete-button" data-id="${evt.id}">Remove</button>
          `;
      eventsContainer.appendChild(eventElement);
  
      const deleteButton = eventElement.querySelector(".delete-button");
      //add event listener to the delete button so we can delete an event
      deleteButton.addEventListener("click", (event) => {
        try {
          event.preventDefault();
          const eventID = event.target.dataset.id;
          removeEvent(eventID);
        } catch (error) {
          console.log(error);
        }
      });
    });
  };
  

//👉 STEP 3: adds a listener to our form so when we submit the form we create a new event
const addListenerToForm = () => {
    const form = document.querySelector("#new-event-form");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      await createNewEvent(
        form.name.value,
        form.description.value,
        form.date.value,
        form.location.value,
      );
  
      //clears the form after we create the new event
      form.name.value = "";
      form.description.value = "";
      form.date.value = "";
      form.location.value = "";
      form.time.value = "";
    });
  };


//👉 STEP 4: Complete the function so that it takes the new event and posts to the API
 const createNewEvent = async (name, description, date, location) => {
   try {
     // console.log(date);
     // console.log(typeof date);
     // console.log(new Date(date).toISOString());
     
     await fetch(API_URL, {
       method: "POST",
       headers: { "Content-Type": "application/json"},
       body: JSON.stringify({
         name,
         description,
         date: new Date(date).toISOString(),
         location,
       }),
     });
 
     fetchAllEvents();
   } catch (error) {
     console.log(error);
   }
 };


//👉 STEP 5: GET and render all events after any new event has been posted to the API

const fetchAllEvents = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    //sets the state to the data we get from the API
    state.events = json.data;

    renderAllEvents();
  } catch (error) {
    console.log(error);
  }
};



//👉 STEP 6: Remove an event from the API after clicking the remove button,
// and then fetch all events again

const removeEvent = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchAllEvents();
  } catch (error) {
    console.log(error);
  }
};


//initial function when the page loads
const init = async () => {
  //gets all the events from the API
  await fetchAllEvents();
  //adds a listener to the form so we can add a event when the user submits the form
  addListenerToForm();
};

init();