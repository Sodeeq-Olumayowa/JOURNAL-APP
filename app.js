const journalForm = document.getElementById("journalForm")
const journalTitle = document.getElementById("journalTitle")
const journalContent = document.getElementById("journalContent")
const journalEntries = document.getElementById("journalEntries")
const saveJournalBtn = document.getElementById("saveJournalBtn")
const cancelEditBtn = document.getElementById("cancelEditBtn")
const journalCategory = document.getElementById("journalCategory")
const searchInput = document.getElementById("searchInput")
const sortJournals = document.getElementById("sortJournals")
const filterCategory = document.getElementById("filterCategory");
const filterFavorites = document.getElementById("filterFavorites");
const totalJournals = document.getElementById("totalJournals");
const totalFavorites = document.getElementById("totalFavorites");
const totalCategories = document.getElementById("totalCategories");
let editingId = null;
let journals = [];
try {
    const savedJournals = JSON.parse(localStorage.getItem("journals"))
    if (Array.isArray(savedJournals)) {
        journals = savedJournals;
    }
}
catch (error) {
    console.log("Unable to load", error)
}
journals = journals.filter(journal => { return journal !== null })
journals = journals.map((journal) => {
    return {
        ...journal,
        id: journal.id || crypto.randomUUID(),
        isFavorite: journal.isFavorite ?? false
    };
});
localStorage.setItem("journals", JSON.stringify(journals))
console.log("all journals", journals)

journalForm.addEventListener("submit", (event) => {
    event.preventDefault()
    if (journalTitle.value.trim() === "" || journalContent.value.trim() === "") {
        alert("please enter a value")
        return
    }
    const timestamp = Date.now();
    const journal = {
        id: crypto.randomUUID(),
        title: journalTitle.value,
        content: journalContent.value,
        category: journalCategory.value,
        createdAt: timestamp,
        updatedAt: timestamp,
        isFavorite: false
    };
    console.log("Editing ID:", editingId);
    console.log("Is null:", editingId === null);
    if (editingId === null) {
        journals.push(journal)
    } else {
        const journalIndex = journals.findIndex((item) => {
            return item.id === editingId;
        })
        if (journalIndex !== -1) {
            const oldCreatedAt = journals[journalIndex].createdAt;
            const oldFavorites = journals[journalIndex].isFavorite;
            journal.isFavorite = oldFavorites;
            journal.id = editingId;
            journal.createdAt = oldCreatedAt;
            journal.updatedAt = Date.now()

            journals[journalIndex] = journal
        };
    };
    localStorage.setItem("journals", JSON.stringify(journals));
    updateJournals();
    editingId = null;
    saveJournalBtn.textContent = "Save Journal";
    journalForm.reset();
})

cancelEditBtn.addEventListener("click", () => {
    editingId = null;
    saveJournalBtn.textContent = "Save Journal";
    journalForm.reset();
})

function updateStatistics() {
    totalJournals.textContent = journals.length;

    const totalFavorite = journals.filter((journal) => {
        return journal.isFavorite === true;
    });
    totalFavorites.textContent = totalFavorite.length;

    const categoryProperties = journals.map((journal) => {
        return journal.category;
    });
    const filterCategory = new Set(categoryProperties);
    totalCategories.textContent = filterCategory.size;
};
updateStatistics()
searchInput.addEventListener("input", updateJournals)
filterCategory.addEventListener("change", updateJournals)
sortJournals.addEventListener("change", updateJournals)
filterFavorites.addEventListener("change", updateJournals);
// update journals for search, sort and category filtering


function updateJournals() {
    let filteredJournals = [...journals]
    const searchTerm = searchInput.value.trim().toLowerCase()
    filteredJournals = filteredJournals.filter((journal) => {
        return journal.title.toLowerCase().includes(searchTerm) ||
            journal.content.toLowerCase().includes(searchTerm)
    });

    const selectedCategory = filterCategory.value;
    if (selectedCategory !== "all") {
        filteredJournals = filteredJournals.filter((journal) => {
            return journal.category === selectedCategory;
        })
    }

    const sortOption = sortJournals.value;
    if (sortOption === "asc") {
        filteredJournals = filteredJournals.sort((a, b) => {
            return a.title.localeCompare(b.title)
        })
    }
    else if (sortOption === "desc") {
        filteredJournals = filteredJournals.sort((a, b) => {
            return b.title.localeCompare(a.title)
        })
    }
    else if (sortOption === "newest") {
        filteredJournals = filteredJournals.sort((a, b) => {
            return (b.createdAt || 0) - (a.createdAt || 0)
        })
    }
    else if (sortOption === "recentlyupdated") {
        filteredJournals = filteredJournals.sort((a, b) => {
            return (b.updatedAt || 0) - (a.updatedAt || 0)
        })
    }
    const favoriteOption = filterFavorites.value;

    if (favoriteOption === "favorites") {
        filteredJournals = filteredJournals.filter((journal) => {
            return journal.isFavorite === true;
        });
    }
    displayJournals(filteredJournals)
    updateStatistics()
};
// displayJournals Function
function displayJournals(journalsToDisplay = journals) {
    journalEntries.innerHTML = "";

    journalsToDisplay.forEach((journal) => {
        const li = document.createElement("li")
        const h3 = document.createElement("h3")
        const p = document.createElement("p")
        const deleteBtn = document.createElement("button")
        const editBtn = document.createElement("button")
        const categoryText = document.createElement("p")
        const dateText = document.createElement("p")
        const updatedText = document.createElement("p");
        const favoriteBtn = document.createElement("button");
        dateText.classList.add("timestamp")
        updatedText.classList.add("timestamp")
        categoryText.classList.add("categoryText");
        editBtn.classList.add("editBtn")
        deleteBtn.classList.add("deleteBtn")
        favoriteBtn.classList.add("favoriteBtn")
        deleteBtn.textContent = "Delete";
        h3.textContent = journal.title;
        p.textContent = journal.content;
        editBtn.textContent = "Edit";
        categoryText.textContent = journal.category;
        dateText.textContent = journal.createdAt
            ? new Date(journal.createdAt).toLocaleString()
            : "Creation Date Unavailble";
        updatedText.textContent = journal.updatedAt
            ? new Date(journal.updatedAt).toLocaleString()
            : "Updated Date Unavailable";
        favoriteBtn.textContent = journal.isFavorite
            ? "Remove from Favorite"
            : "Add to Favorites";

        li.appendChild(h3)
        li.appendChild(categoryText)
        li.appendChild(p)
        li.appendChild(editBtn)
        li.appendChild(deleteBtn)
        li.appendChild(dateText)
        li.appendChild(updatedText)
        li.appendChild(favoriteBtn)
        journalEntries.appendChild(li)

        favoriteBtn.addEventListener("click", () => {
            const journalId = journals.findIndex((item) => {
                return item.id === journal.id;
            })
            if (journalId !== -1) {
                journals[journalId].isFavorite = !journals[journalId].isFavorite;
            }
            localStorage.setItem("journals", JSON.stringify(journals))
            updateJournals();
        })
        deleteBtn.addEventListener("click", () => {
            const journalIndex = journals.findIndex((item) => {
                return item.id === journal.id;
            })
            if (journalIndex !== -1) {
                journals.splice(journalIndex, 1)
            }
            console.log(journalIndex)
            localStorage.setItem("journals", JSON.stringify(journals))
            updateJournals();
        })
        editBtn.addEventListener("click", () => {
            editingId = journal.id;
            journalTitle.value = journal.title;
            journalContent.value = journal.content;
            journalCategory.value = journal.category;
            saveJournalBtn.textContent = "Update Journal";
        })

    })
}
displayJournals()



// // EVENT LISTENERS
// searchInput.addEventListener("input", () => {
//     const searchTerm = searchInput.value.trim().toLowerCase();
//     const filteredJournals = journals.filter((filteredJournal) => {
//         return filteredJournal.title.toLowerCase().includes(searchTerm)
//             || filteredJournal.content.toLowerCase().includes(searchTerm)
//             || filteredJournal.category.toLowerCase().includes(searchTerm)
//     })
//     displayJournals(filteredJournals)
// });
// //FILTER CATEGORY LISTENERS
// filterCategory.addEventListener("change", () => {
//     const selectedCategory = filterCategory.value
//     if (selectedCategory === "all") {
//         displayJournals()
//     }
//     else {
//         const filteredCategory = journals.filter((journal) => {
//             return journal.category === selectedCategory
//         })
//         displayJournals(filteredCategory)
//     }
// });
// // SORT EVENT LISTENERS
// sortJournals.addEventListener("change", () => {
//     if (sortJournals.value === "asc") {
//         const sortedJournals = [...journals].sort((a, b) => {
//             return a.title.localeCompare(b.title)
//         })
//         displayJournals(sortedJournals)
//     }
//     else if (sortJournals.value === "desc") {
//         const sortedJournals = [...journals].sort((a, b) => {
//             return b.title.localeCompare(a.title)
//         })
//         displayJournals(sortedJournals)
//     }
//     else if (sortJournals.value === "newest") {
//         const sortedJournals = [...journals].sort((a, b) => {
//             return (b.createdAt || 0) - (a.createdAt || 0)
//         })
//         displayJournals(sortedJournals)
//     }
//     else if (sortJournals.value === "default") {
//         displayJournals()
//     }
// });