const state = {
  parties: {},
  selectedParty: null,
};

const homeSection = document.getElementById("home");
const createSection = document.getElementById("create-party");
const joinSection = document.getElementById("join-party");
const dashboard = document.getElementById("party-dashboard");

const partyName = document.getElementById("party-name");
const partyCode = document.getElementById("party-code");
const partyAdmin = document.getElementById("party-admin");
const partyStart = document.getElementById("party-start");
const partyEnd = document.getElementById("party-end");

const playersList = document.getElementById("players-list");
const addPlayerForm = document.getElementById("add-player-form");
const questionsList = document.getElementById("questions-list");
const addQuestionForm = document.getElementById("add-question-form");
const voterSelect = document.getElementById("voter-select");
const votingQuestions = document.getElementById("voting-questions");
const oddsPreview = document.getElementById("odds-preview");
const resolutionList = document.getElementById("resolution-list");
const scoreboard = document.getElementById("scoreboard");

function uid(length = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function currentParty() {
  return state.selectedParty ? state.parties[state.selectedParty] : null;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleString();
}

function showSection(section) {
  [homeSection, createSection, joinSection, dashboard].forEach((el) => {
    el.hidden = el !== section;
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".pill").forEach((pill) => {
    const isActive = pill.dataset.tab === tabId;
    pill.classList.toggle("active", isActive);
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.hidden = tab.id !== `tab-${tabId}`;
  });
}

function renderParty() {
  const party = currentParty();
  if (!party) return;

  partyName.textContent = party.name;
  partyCode.textContent = party.code;
  partyAdmin.textContent = party.admin;
  partyStart.textContent = formatDate(party.startTime);
  partyEnd.textContent = formatDate(party.endTime);

  renderPlayers();
  renderQuestions();
  renderVoting();
  renderResolutions();
  renderScoreboard();
}

function renderPlayers() {
  const party = currentParty();
  playersList.innerHTML = "";
  party.players.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = player;
    playersList.appendChild(li);
  });

  voterSelect.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "Selecciona votante";
  voterSelect.appendChild(empty);

  party.players.forEach((player) => {
    const option = document.createElement("option");
    option.value = player;
    option.textContent = player;
    voterSelect.appendChild(option);
  });
}

function renderQuestions() {
  const party = currentParty();
  questionsList.innerHTML = "";
  party.questions.forEach((question) => {
    questionsList.appendChild(buildQuestionCard(question, true));
  });
}

function buildQuestionCard(question, showOdds = false) {
  const template = document.getElementById("question-template");
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector(".question-text").textContent = question.text;
  const meta = node.querySelector(".meta");
  const votesCount = Object.keys(question.votes).length;
  meta.textContent = `${votesCount} voto${votesCount === 1 ? "" : "s"} · Bote ${question.pot} pts`;

  if (showOdds) {
    const odds = calculateOdds(question, currentParty().players);
    const oddsEl = document.createElement("div");
    oddsEl.className = "question-actions";
    odds.forEach(({ player, quota }) => {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = `${player}: cuota ${quota}`;
      oddsEl.appendChild(badge);
    });
    node.appendChild(oddsEl);
  }

  return node;
}

function renderVoting() {
  const party = currentParty();
  const voter = voterSelect.value;
  votingQuestions.innerHTML = "";

  party.questions.forEach((question) => {
    const wrapper = document.createElement("div");
    wrapper.className = "question";
    const title = document.createElement("p");
    title.className = "question-text";
    title.textContent = question.text;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `Bote ${question.pot} pts · ${Object.keys(question.votes).length} votos`;

    const selector = document.createElement("select");
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Elige jugador";
    selector.appendChild(placeholder);
    party.players
      .filter((p) => p !== voter)
      .forEach((player) => {
        const option = document.createElement("option");
        option.value = player;
        option.textContent = player;
        selector.appendChild(option);
      });

    selector.value = question.votes[voter] || "";
    selector.addEventListener("change", () => {
      if (!voter) return;
      question.votes[voter] = selector.value;
      renderParty();
    });

    wrapper.append(title, meta, selector);
    votingQuestions.appendChild(wrapper);
  });

  renderOddsPreview();
}

function renderOddsPreview() {
  const party = currentParty();
  oddsPreview.innerHTML = "";
  party.questions.forEach((question) => {
    const container = document.createElement("div");
    container.className = "panel";
    const title = document.createElement("p");
    title.className = "question-text";
    title.textContent = question.text;
    const odds = calculateOdds(question, party.players);
    const meta = document.createElement("div");
    meta.className = "question-actions";
    odds.forEach(({ player, quota }) => {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = `${player}: ${quota}`;
      meta.appendChild(badge);
    });
    container.append(title, meta);
    oddsPreview.appendChild(container);
  });
}

function renderResolutions() {
  const party = currentParty();
  resolutionList.innerHTML = "";

  party.questions.forEach((question) => {
    const card = document.createElement("div");
    card.className = "question";
    const title = document.createElement("p");
    title.className = "question-text";
    title.textContent = question.text;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `Votos: ${Object.keys(question.votes).length} · Bote ${question.pot}`;

    const selector = document.createElement("select");
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Quién lo cumplió";
    selector.appendChild(placeholder);

    party.players.forEach((player) => {
      const option = document.createElement("option");
      option.value = player;
      option.textContent = player;
      selector.appendChild(option);
    });

    selector.value = question.result || "";
    selector.addEventListener("change", () => {
      question.result = selector.value;
    });

    card.append(title, meta, selector);
    resolutionList.appendChild(card);
  });
}

function renderScoreboard() {
  const party = currentParty();
  const totals = computeTotals(party);

  scoreboard.innerHTML = "";
  if (totals.length === 0) {
    scoreboard.innerHTML = '<p class="muted">Aún no hay resultados. Marca los hechos reales.</p>';
    return;
  }

  const list = document.createElement("div");
  list.className = "scoreboard";
  totals.forEach((row, index) => {
    const entry = document.createElement("div");
    entry.className = "score-row";
    entry.innerHTML = `<span>${index + 1}. ${row.player} · ${row.correct} aciertos</span><strong>${row.points} pts</strong>`;
    list.appendChild(entry);
  });
  scoreboard.appendChild(list);
}

function calculateOdds(question, players) {
  const votes = players.reduce((acc, player) => {
    const count = Object.values(question.votes).filter((v) => v === player).length;
    acc[player] = count;
    return acc;
  }, {});
  const totalVotes = Object.keys(question.votes).length || 1;
  return players.map((player) => {
    const votesForPlayer = votes[player];
    const quota = (totalVotes / Math.max(votesForPlayer, 1)).toFixed(2);
    return { player, quota };
  });
}

function computeTotals(party) {
  const scores = {};
  party.players.forEach((p) => (scores[p] = { player: p, points: 0, correct: 0 }));

  party.questions.forEach((question) => {
    if (!question.result) return;
    const totalVotes = Object.keys(question.votes).length;
    const winners = Object.entries(question.votes).filter(([, vote]) => vote === question.result);
    if (winners.length === 0) return;
    const votesForResult = winners.length;
    const quota = totalVotes / votesForResult || 1;
    const basePot = question.pot;
    const payout = Math.round((basePot * quota) / votesForResult);

    winners.forEach(([player]) => {
      scores[player].points += payout;
      scores[player].correct += 1;
    });
  });

  return Object.values(scores).sort((a, b) => b.points - a.points);
}

function ensurePartySelected(code) {
  state.selectedParty = code;
  showSection(dashboard);
  renderParty();
}

// Event bindings

document.getElementById("go-create").addEventListener("click", () => {
  showSection(createSection);
});

document.getElementById("go-join").addEventListener("click", () => {
  showSection(joinSection);
});

[...document.querySelectorAll("[data-close]")].forEach((btn) => {
  btn.addEventListener("click", () => showSection(homeSection));
});

// Tabs

document.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", () => switchTab(pill.dataset.tab));
});

// Forms

addPlayerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(addPlayerForm);
  const player = formData.get("player");
  const party = currentParty();
  if (!player || party.players.includes(player)) return;
  party.players.push(player);
  addPlayerForm.reset();
  renderParty();
});

addQuestionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(addQuestionForm);
  const text = formData.get("question");
  if (!text) return;
  const pot = parseInt(formData.get("pot"), 10) || 100;
  const party = currentParty();
  party.questions.push({ id: uid(6), text, pot, votes: {}, result: "" });
  addQuestionForm.reset();
  renderParty();
});

voterSelect.addEventListener("change", renderVoting);

document.getElementById("create-party-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get("name");
  const admin = formData.get("admin");
  const start = formData.get("start");
  const end = formData.get("end");
  const code = uid();

  state.parties[code] = {
    code,
    name,
    admin,
    startTime: start,
    endTime: end,
    players: [admin],
    questions: [],
  };

  ensurePartySelected(code);
});

document.getElementById("join-party-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const code = formData.get("code");
  const player = formData.get("player");

  const party = state.parties[code];
  if (!party) {
    alert("No se encontró la party. Crea una primero.");
    return;
  }
  if (!party.players.includes(player)) {
    party.players.push(player);
  }
  ensurePartySelected(code);
});

// Results

document.getElementById("compute-results").addEventListener("click", () => {
  renderScoreboard();
  alert("Resultados calculados. Revisa la clasificación final.");
});

// Demo data for faster exploration
(function seedDemo() {
  const code = uid();
  state.parties[code] = {
    code,
    name: "Demo Night",
    admin: "Admin",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600 * 1000).toISOString(),
    players: ["Admin", "Ana", "Luis", "Marta"],
    questions: [
      { id: uid(6), text: "¿Quién es el más probable que se líe con alguien?", pot: 120, votes: {}, result: "" },
      { id: uid(6), text: "¿Quién perderá primero el móvil?", pot: 100, votes: {}, result: "" },
    ],
  };
  state.selectedParty = code;
  renderParty();
})();
