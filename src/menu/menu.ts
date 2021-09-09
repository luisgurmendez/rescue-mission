import { SavedLevel } from "../levels/levels";
import AstronautRenderUtils from "../objects/astronaut/astronautRenderUtils";
import { callTimes } from "../utils/fn";

interface MenuItem {
  label: string;
  onClick: () => void;
}

function noop() { }

type Fn = () => void;
type GoToLevelFn = (i: number) => void

export function createMenu(onResume: Fn, allLevels: number, reachedLevel: number, savedLevels: SavedLevel, goToLevel: GoToLevelFn) {
  const menuContainerEl = document.getElementById('menu-container');
  let activeMenuPageIndex = 0;
  let activeMenuElement: HTMLElement | null = null;

  function changeMenuPage(to: number) {
    if (activeMenuElement !== null) {
      activeMenuElement.remove();
    }
    activeMenuPageIndex = to;
    activeMenuElement = menuPagesElements[activeMenuPageIndex];
    menuContainerEl!.append(activeMenuElement);
  }

  function onBack() {
    changeMenuPage(0);
  }

  const handleGoToLevelAndResume = (i: number) => {
    goToLevel(i);
    onResume()
  }

  const menu = createMenuContent(onResume, changeMenuPage);
  const objective = createObjectiveContent(onBack);
  const controls = createControlsContent(onBack)
  const levels = createLevelsContent(onBack, allLevels, reachedLevel, savedLevels, handleGoToLevelAndResume);
  const menuPagesElements = [menu, objective, controls, levels]; // Menu

  changeMenuPage(0);

  const backdrop = createMenuBackdrop();
  menuContainerEl?.append(backdrop)
}

export function disposeMenu() {
  const menuEl = document.getElementById('menu');
  const backdropEl = document.getElementById('menu-backdrop');
  backdropEl?.remove()
  menuEl?.remove();
}

function createMenuContent(onResume: Fn, onChangePage: (i: number) => void) {
  const menu = document.createElement('div');
  menu.id = 'menu';

  const items: MenuItem[] = [
    { label: 'Resume game', onClick: onResume },
    { label: 'Objective', onClick: () => onChangePage(1) },
    { label: 'Controls', onClick: () => onChangePage(2), },
    { label: 'Levels', onClick: () => onChangePage(3) },
  ]
  const title = createMenuTitle('Menu');
  const itemElements = items.map(i => createMenuButton(i.label, i.onClick));
  menu.append(title, ...itemElements);
  return menu;
}

function createMenuButton(label: string, onClick: Fn): Node {
  const itemEl = document.createElement('button');
  itemEl.innerText = label;
  itemEl.className = "menu-item";
  itemEl.addEventListener('click', onClick);
  return itemEl;
}

function createMenuBackdrop() {
  const backdrop = document.createElement('div');
  backdrop.id = 'menu-backdrop';
  return backdrop;
}

function createMenuTitle(title: string) {
  const titleEl = document.createElement('div')
  titleEl.className = "menu-title";
  titleEl.innerText = title;
  return titleEl;
}

function createControlsContent(onBack: Fn) {
  const menu = document.createElement('div');
  menu.id = 'menu';
  const title = createMenuTitle('Controls')
  const controls = [
    'w,a,s,d - movement',
    `'space' - follow rocket`,
    `'.' or ',' or mouse wheel - zoom in/out`,
    'click & drag to move camera',
    'm - toggle menu',
    'p - toggle pause',
    'r - restart level',
    'x - increase game speed',
    'z - decrease game speed',
  ]
  const back = createMenuButton('< Back', onBack);
  const controlEls = controls.map(createTextRow)
  const itemElements = [title, ...controlEls, back]
  menu.append(...itemElements);
  return menu;
}

export const objectiveTexts = [
  "Use your thrusters to rescue,",
  "as many astronauts as you can,",
  "and try to land slowly in the blue planet"
];

function createObjectiveContent(onBack: Fn) {
  const menu = document.createElement('div');
  menu.id = 'menu';
  const title = createMenuTitle('Objective')

  const back = createMenuButton('< Back', onBack);
  const objective = objectiveTexts.map(createTextRow)
  const itemElements = [title, ...objective, back]
  menu.append(...itemElements);
  return menu;
}

function createTextRow(control: string) {
  const itemEl = document.createElement('div');
  itemEl.innerText = control
  itemEl.className = "control-item";
  return itemEl;
}
interface LevelOption {
  name: string;
  numOfRescues: number;
  disabled: boolean;
  onClick: Fn
}

function createLevelsContent(onBack: Fn, numOfLevels: number, reachedLevel: number, savedLevels: SavedLevel, goToLevel: GoToLevelFn) {
  const menu = document.createElement('div');
  menu.id = 'menu';
  const title = createMenuTitle('Levels')
  const back = createMenuButton('< Back', onBack);
  const levels: LevelOption[] = [];
  callTimes(numOfLevels, (i: number) => {
    // TODO: Have names for the levels?
    levels.push({
      name: `Level ${i + 1}`,
      disabled: reachedLevel < i,
      numOfRescues: savedLevels[i] || 0,
      onClick: () => goToLevel(i)
    });
  })
  const levelEls = levels.map(level => createLevelElement(level))

  const itemElements = [title, ...levelEls, back]

  menu.append(...itemElements);
  return menu;
}


function createLevelElement(level: LevelOption) {
  const levelItemContainer = document.createElement('div');
  levelItemContainer.className = 'level-item-container';

  const itemEl = document.createElement('button');
  itemEl.innerText = level.name;
  itemEl.disabled = level.disabled;
  itemEl.className = "menu-item level-item";
  itemEl.addEventListener('click', level.onClick);

  const astronautEls = AstronautRenderUtils.generateAstronautRescuesPixelArts(level.numOfRescues);
  astronautEls.forEach(a => {
    a.style.marginLeft = '4px';
  })
  const rescuedLabel = document.createElement('span');
  rescuedLabel.innerText = "Rescued: "
  rescuedLabel.className = "rescued"

  levelItemContainer.appendChild(itemEl);
  levelItemContainer.appendChild(rescuedLabel);
  levelItemContainer.append(...astronautEls);

  return levelItemContainer;
}

