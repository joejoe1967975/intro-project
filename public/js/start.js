

import './people.js'
import "./landlords.js";
import "./buildings.js";
import './form.js'


document.addEventListener( "DOMContentLoaded", function() {
  configurepeopleheaders()
} )


const daynames = [ "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat" ]

function configurepeopleheaders() {
  let currentdate = new Date()

  // Calculate the difference in days between the current day and Monday (considering Monday as the first day of the week, where Sunday is 0)
  let dayofweek = currentdate.getDay()
  let daysuntilmonday = ( dayofweek === 0 ) ? 6 : ( 1 - dayofweek )

  // Adjust the date to Monday of this week
  currentdate.setDate( currentdate.getDate() + daysuntilmonday )

  const days = document.getElementsByClassName( "days" )
  for ( let i = 0; i < days.length; i++ ) {
    days[ i ].querySelectorAll( ".day-1" )[ 0 ].textContent = daynames[ currentdate.getDay() ] + " " + currentdate.getDate()
    currentdate.setDate( currentdate.getDate() + 1 )
    days[ i ].querySelectorAll( ".day-2" )[ 0 ].textContent = daynames[ currentdate.getDay() ] + " " + currentdate.getDate()
    currentdate.setDate( currentdate.getDate() + 1 )
    days[ i ].querySelectorAll( ".day-3" )[ 0 ].textContent = daynames[ currentdate.getDay() ] + " " + currentdate.getDate()
    currentdate.setDate( currentdate.getDate() + 1 )
    days[ i ].querySelectorAll( ".day-4" )[ 0 ].textContent = daynames[ currentdate.getDay() ] + " " + currentdate.getDate()
    currentdate.setDate( currentdate.getDate() + 1 )
    days[ i ].querySelectorAll( ".day-5" )[ 0 ].textContent = daynames[ currentdate.getDay() ] + " " + currentdate.getDate()
    currentdate.setDate( currentdate.getDate() + 1 )
    days[ i ].querySelectorAll( ".day-6" )[ 0 ].textContent = daynames[ currentdate.getDay() ] + " " + currentdate.getDate()
    currentdate.setDate( currentdate.getDate() + 1 )
    days[ i ].querySelectorAll( ".day-7" )[ 0 ].textContent = daynames[ currentdate.getDay() ] + " " + currentdate.getDate()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-tab");

      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      tabContents.forEach(content => {
        content.classList.remove("active");
        if (content.id === targetId) {
          content.classList.add("active");
        }
      });
    });
  });
});
