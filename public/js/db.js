const form = document.querySelector('.add-recipe')

// offline data
db.enablePersistence()
    .catch(error => {
        if(error.code === 'failed-precondition'){
            console.error('Persistence failed')
        }
        else if(error.code === 'unimplemented'){
            console.error('Browser do not support persistence')
        }
    })

// real-time listener
db.collection('recipes').onSnapshot(snapshot=>

    snapshot.docChanges().forEach(change=>{

        if(change.type === 'added'){
            renderRecipe(change.doc.data(), change.doc.id)
        }
        else if(change.type === 'removed'){
            removeRecipe(change.doc.id)
        }
    })
)

//add new recipe
form.addEventListener('submit', event =>{

    event.preventDefault()

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    }

    db.collection('recipes').add(recipe).catch(error=>console.error(error))

    form.title.value=""
    form.ingredients.value=""
})

// delete a recipe
recipes.addEventListener('click', event =>{
    if(event.target.tagName === "I"){
        const id = event.target.getAttribute('data-id')
        db.collection('recipes').doc(id).delete()
    }
})
