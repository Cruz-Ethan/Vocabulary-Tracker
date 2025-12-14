let vocabList = []
let editingVocabId = null

function saveWord(event) {
    event.preventDefault()

    const word = document.getElementById('vocabWord').value.trim().toLowerCase()
    const translations = document.getElementById('vocabTranslation').value.trim().toLowerCase().split(/\s*,\s*/)
    const language = document.getElementById('vocabLanguage').value.trim().toUpperCase()

    if(editingVocabId) {
        const vocabIndex = vocabList.findIndex(vocab => vocab.id == editingVocabId)
        vocabList[vocabIndex] = {
            id: editingVocabId,
            word: word,
            translations: translations,
            language: language
        }
    }
    else {
        vocabList.unshift({
            id: generateId(),
            word: word,
            translations: translations,
            language: language
        })
    }

    saveList()
    renderVocab()
    closeVocabDialog()
}

function generateId() {
    return Date.now().toString()
}

function loadList() {
    const savedList = localStorage.getItem('vocab-list')
    return savedList ? JSON.parse(savedList) : []
}

function saveList() {
    localStorage.setItem('vocab-list', JSON.stringify(vocabList))
}

function deleteWord(vocabId) {
    vocabList = vocabList.filter(vocab => vocab.id != vocabId)
    saveList()
    renderVocab()
}

function matchesSearch(vocab) {
    const searchBar = document.getElementById('searchBar')
    const searchValue = searchBar.value

    return vocab.word.includes(searchValue) ||
            vocab.translations.reduce((isFound, translation) => isFound || translation.includes(searchValue), false) ||
            vocab.language.includes(searchValue)
}

function renderVocab() {
    const vocabContainer = document.getElementById("vocabContainer")

    if(vocabList.length === 0) {
        vocabContainer.innerHTML = `
            <div class="empty-state">
                <h2>No vocab yet</h2>
                <p>Add your first word to get started!</p>
                <button class="add-vocab-button" onClick="openVocabDialog()">+ Add your first word</button>
            </div>
        `

        return
    }

    const isDark = localStorage.getItem('theme') == 'dark'

    vocabContainer.innerHTML = vocabList.map(vocab => matchesSearch(vocab) ? `
        <div class='vocab-display'>
            <h3 class='vocab-word'>${vocab.word}</h3>

            <div class='vocab-actions'>
                <button class='edit-button' onClick='openVocabDialog(${vocab.id})' title='Edit Word'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="${isDark ? '#e6e4dc' : '#191b23'}">
                        <path d="M184-184v-83.77l497.23-498.77q5.15-5.48 11.07-7.47 5.93-1.99 11.99-1.99 6.06 0 11.62 1.54 5.55 1.54 11.94 7.15l38.69 37.93q5.61 6.38 7.54 12 1.92 5.63 1.92 12.25 0 6.13-2.24 12.06-2.24 5.92-7.22 11.07L267.77-184H184Zm505.15-466.46L744-704.54 704.54-744l-54.08 54.85 38.69 38.69Z"/>
                    </svg>
                </button>

                <button class='delete-button' onClick='deleteWord(${vocab.id})' title='Delete Word'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="${isDark ? '#e6e4dc' : '#191b23'}">
                        <path d="M291-267.69 267.69-291l189-189-189-189L291-692.31l189 189 189-189L692.31-669l-189 189 189 189L669-267.69l-189-189-189 189Z"/>
                    </svg>
                </button>
            </div>
        </div>
    ` : '').join('')
}

function openVocabDialog(vocabId = null) {
    const dialog = document.getElementById('vocabDialog')
    const wordInput = document.getElementById('vocabWord')
    const translationInput = document.getElementById('vocabTranslation')
    const languageInput = document.getElementById('vocabLanguage')

    if(vocabId) {
        const vocabToEdit = vocabList.find(vocab => vocab.id == vocabId)
        editingVocabId = vocabId
        document.getElementById('dialogTitle').innerHTML = 'Edit Note'

        wordInput.value = vocabToEdit.word
        translationInput.value = vocabToEdit.translations.join(', ')
        languageInput.value = vocabToEdit.language
    }
    else {
        editingNoteId = null
        document.getElementById('dialogTitle').innerHTML = 'Add New Note'

        wordInput.value = ''
        translationInput.value = ''
        languageInput.value = ''
    }

    dialog.showModal()
    wordInput.focus()
}

function closeVocabDialog() {
    const dialog = document.getElementById('vocabDialog')
    dialog.close()
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    renderVocab()
}

function applyStoredTheme() {
    if(localStorage.getItem('theme') == 'dark') {
        document.body.classList.add('dark-theme')
    }
}

document.addEventListener('DOMContentLoaded', function () {
    vocabList = loadList()
    renderVocab()
    applyStoredTheme()

    const vocabForm = document.getElementById('vocabForm')
    vocabForm.addEventListener('submit', saveWord)

    const themeToggleButton = document.getElementById('themeToggleButton')
    themeToggleButton.addEventListener('click', toggleTheme)

    const searchBar = document.getElementById('searchBar')
    searchBar.addEventListener('keyup', renderVocab)

    const dialog = document.getElementById('vocabDialog')
    dialog.addEventListener('click', function(event) {
        if(event.target === this) {
            closeVocabDialog()
        }
    })
})