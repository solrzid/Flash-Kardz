let folders = JSON.parse(localStorage.getItem('folders')) || {};
let currentFolder = '';
let currentFlashcardIndex = 0;
let folderToDelete = null;
let flashcardToDelete = null;
let flashcardToEdit = null;
let folderToRename = null;






function openAboutModal() {
  const aboutModal = document.getElementById("aboutModal");
  aboutModal.style.display = "flex"; 
}

function closeAboutModal() {
  const aboutModal = document.getElementById("aboutModal");
  aboutModal.style.display = "none"; 
}

function saveToStorage() {
  localStorage.setItem('folders', JSON.stringify(folders));
}

function createFolder() {
  const folderName = document.getElementById('folder-name').value.trim();
  if (folderName && !folders[folderName]) {
    folders[folderName] = [];
    saveToStorage();
    updateFolderOptions();
    document.getElementById('folder-name').value = '';
    showModal("Folder created successfully!");
  } else {
    showModal("Folder name is invalid or already exists.");
  }
}

function updateFolderOptions() {
  const folderSelect = document.getElementById('folder-select');
  folderSelect.innerHTML = '<option disabled selected>Select a folder</option>';
  for (const folder in folders) {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    folderSelect.appendChild(option);
  }
}

function renameFolder() {
  const folderName = document.getElementById('folder-select').value;

  if (!folderName) {
    showModal("Please select a folder to rename.");
    return;
  }

  
  folderToRename = folderName; 
  const modalInput1 = document.getElementById("modal-input-1");
  modalInput1.value = folderName; 
  modalInput1.style.display = "block"; 
  document.getElementById("modal-input-2").style.display = "none"; 

  showModal("Rename Folder", true, "Rename", saveRenamedFolder); 
}

function saveRenamedFolder() {
  const newFolderName = document.getElementById("modal-input-1").value.trim();

  if (!newFolderName) {
    showModal("Folder name cannot be empty.");
    return;
  }

  if (folders[newFolderName]) {
    showModal("A folder with this name already exists.");
    return;
  }

  
  folders[newFolderName] = folders[folderToRename];
  delete folders[folderToRename];

  saveToStorage();
  updateFolderOptions();
  document.getElementById('folder-select').value = newFolderName; 
  renderFlashcards();

  folderToRename = null;
  closeModal(); 

  
  showModal("Folder renamed successfully!");
}



function openRenameFolderModal() {
  const folderName = document.getElementById('folder-select').value;

  if (!folderName) {
    showModal("Please select a folder to rename.");
    return;
  }

  folderToRename = folderName; 
  const renameFolderInput = document.getElementById("renameFolderInput");
  renameFolderInput.value = folderName; 

  const renameFolderModal = document.getElementById("renameFolderModal");
  renameFolderModal.style.display = "flex"; 
}


function closeRenameFolderModal() {
  const renameFolderModal = document.getElementById("renameFolderModal");
  renameFolderModal.style.display = "none"; 
}


function confirmRenameFolder() {
  const newFolderName = document.getElementById("renameFolderInput").value.trim();

  if (!newFolderName) {
    showModal("Folder name cannot be empty.");
    return;
  }

  if (folders[newFolderName]) {
    showModal("A folder with this name already exists.");
    return;
  }

  
  folders[newFolderName] = folders[folderToRename];
  delete folders[folderToRename];

  saveToStorage();
  updateFolderOptions();
  document.getElementById('folder-select').value = newFolderName;

  folderToRename = null;
  closeRenameFolderModal();

  
  showModal("Folder renamed successfully!");
}


function saveToStorage() {
  localStorage.setItem('folders', JSON.stringify(folders));
}


function updateFolderOptions() {
  const folderSelect = document.getElementById('folder-select');
  folderSelect.innerHTML = '<option value="" disabled selected>Select a folder</option>';
  for (const folder in folders) {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    folderSelect.appendChild(option);
  }
}


function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  modalMessage.textContent = message;
  modal.style.display = "flex"; 

  
  setTimeout(() => {
    modal.style.display = "none"; 
  }, 2000);S
}


function deleteFolder() {
  const folderName = document.getElementById('folder-select').value;
  if (!folderName) {
    showModal("Please select a folder to delete.");
    return;
  }

  folderToDelete = folderName;
  showModal(`Are you sure you want to delete the folder "${folderName}"?`, true, "Delete", confirmDeleteFolder);
}

function confirmDeleteFolder() {
  if (folderToDelete) {
    delete folders[folderToDelete];
    saveToStorage();
    updateFolderOptions();
    renderFlashcards();
    showModal("Folder deleted successfully!");
    folderToDelete = null;
    closeModal();
  }
}

function addFlashcard() {
  const folder = document.getElementById('folder-select').value;
  const question = document.getElementById('new-question').value.trim();
  const answer = document.getElementById('new-answer').value.trim();

  if (!folder) {
    showModal("Please select a folder.");
    return;
  }
  if (!question || !answer) {
    showModal("Please fill in both the question and answer.");
    return;
  }

  folders[folder].push({ question, answer });
  saveToStorage();
  document.getElementById('new-question').value = '';
  document.getElementById('new-answer').value = '';
  renderFlashcards();
  showModal("Flashcard added successfully!");
}

function renderFlashcards() {
  currentFolder = document.getElementById('folder-select').value;
  const list = document.getElementById('flashcardsList');
  list.innerHTML = '';

  if (!currentFolder || !folders[currentFolder]) return;

  currentFlashcardIndex = 0;
  renderCurrentFlashcard();
  showNavigationButtons();
}

function renderCurrentFlashcard() {
  const folder = folders[currentFolder];
  if (!folder || folder.length === 0) {
    document.getElementById('flashcardsList').innerHTML = '<p>No flashcards available in this folder.</p>';
    return;
  }

  const currentFlashcard = folder[currentFlashcardIndex];
  const list = document.getElementById('flashcardsList');
  list.innerHTML = '';

  const cardDiv = document.createElement('div');
  cardDiv.className = 'flashcard-item';

  const flipCard = document.createElement('div');
  flipCard.className = 'flip-card';
  flipCard.setAttribute('onclick', 'flipCard(this)');

  const flipCardInner = document.createElement('div');
  flipCardInner.className = 'flip-card-inner';

  const front = document.createElement('div');
  front.className = 'flip-card-front';
  front.innerHTML = `<strong>Q:</strong> ${currentFlashcard.question}`;

  const back = document.createElement('div');
  back.className = 'flip-card-back';
  back.innerHTML = `<strong>A:</strong> ${currentFlashcard.answer}`;

  flipCardInner.appendChild(front);
  flipCardInner.appendChild(back);
  flipCard.appendChild(flipCardInner);

  cardDiv.appendChild(flipCard);

  const controls = document.createElement('div');
  controls.className = 'edit-delete-buttons';
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => openEditFlashcardModal(currentFlashcardIndex);
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => openDeleteFlashcardModal(currentFlashcardIndex);
  controls.appendChild(editBtn);
  controls.appendChild(deleteBtn);

  cardDiv.appendChild(controls);

  list.appendChild(cardDiv);
}

function flipCard(card) {
  const cardInner = card.querySelector('.flip-card-inner');
  if (cardInner.style.transform === 'rotateY(180deg)') {
    cardInner.style.transform = ''; 
  } else {
    cardInner.style.transform = 'rotateY(180deg)'; 
  }
}

function openEditFlashcardModal(index) {
  flashcardToEdit = index;
  const folder = folders[currentFolder];
  const flashcard = folder[index];

  const modalInput1 = document.getElementById("modal-input-1");
  const modalInput2 = document.getElementById("modal-input-2");

  modalInput1.value = flashcard.question;
  modalInput2.value = flashcard.answer;
  modalInput1.style.display = "block";
  modalInput2.style.display = "block";

  showModal("Edit Flashcard", true, "Save", saveEditedFlashcard);
}

function saveEditedFlashcard() {
  const folder = folders[currentFolder];
  const flashcard = folder[flashcardToEdit];

  const newQuestion = document.getElementById("modal-input-1").value.trim();
  const newAnswer = document.getElementById("modal-input-2").value.trim();

  if (!newQuestion || !newAnswer) {
    showModal("Please fill in both the question and answer.");
    return;
  }

  flashcard.question = newQuestion;
  flashcard.answer = newAnswer;

  saveToStorage();
  renderFlashcards();
  closeModal();
  flashcardToEdit = null;
}

function openDeleteFlashcardModal(index) {
  flashcardToDelete = index;
  showModal("Are you sure you want to delete this flashcard?", true, "Delete", confirmDeleteFlashcard);
}

function confirmDeleteFlashcard() {
  const folder = folders[currentFolder];
  if (folder && folder.length > flashcardToDelete) {
    folder.splice(flashcardToDelete, 1);
    saveToStorage();
    renderFlashcards();
    closeModal();
    flashcardToDelete = null;
    showModal("Flashcard deleted successfully!"); 
  } else {
    showModal("Unable to delete flashcard.");
  }
}

function navigateFlashcard(direction) {
  const folder = folders[currentFolder];
  if (!folder || folder.length === 0) return;

  if (direction === 'next' && currentFlashcardIndex < folder.length - 1) {
    currentFlashcardIndex++;
  } else if (direction === 'prev' && currentFlashcardIndex > 0) {
    currentFlashcardIndex--;
  }

  renderCurrentFlashcard();
  showNavigationButtons();
}

function showNavigationButtons() {
  const folder = folders[currentFolder];
  if (!folder || folder.length === 0) {
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true;
    return;
  }

  document.getElementById('prevBtn').disabled = currentFlashcardIndex === 0;
  document.getElementById('nextBtn').disabled = currentFlashcardIndex === folder.length - 1;
}

function showModal(message, showButtons = false, confirmButtonText = "Yes", confirmAction = null) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const modalButtons = document.getElementById("modal-buttons");
  const modalInputContainer = document.getElementById("modal-input-container");
  const confirmBtn = document.getElementById("confirm-btn");

  modalMessage.textContent = message;
  modal.style.display = "block";

  if (showButtons) {
    modalButtons.style.display = "block";
    confirmBtn.textContent = confirmButtonText;
    confirmBtn.onclick = confirmAction;
  } else {
    modalButtons.style.display = "none";
  }

  if (message === "Edit Flashcard" || message === "Rename Folder") {
    modalInputContainer.style.display = "block";
  } else {
    modalInputContainer.style.display = "none";
  }
}



function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  folderToDelete = null;
  flashcardToDelete = null;
  flashcardToEdit = null;
  folderToRename = null;
}

function init() {
  updateFolderOptions();
}

init();