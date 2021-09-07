import { callTimes } from "../utils/fn";

interface MenuItem {
  label: string;
  onClick: () => void;
}

function noop() { }

type Fn = () => void;
type GoToLevelFn = (i: number) => void

export function createMenu(onResume: Fn, allLevels: number, reachedLevel: number, goToLevel: GoToLevelFn) {
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
  const controls = createControlsContent(onBack)
  const levels = createLevelsContent(onBack, allLevels, reachedLevel, handleGoToLevelAndResume);
  const menuPagesElements = [menu, controls, levels]; // Menu

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
    { label: 'Controls', onClick: () => onChangePage(1), },
    { label: 'Levels', onClick: () => onChangePage(2) },
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
  const controlEls = controls.map(createControlItem)
  const itemElements = [title, ...controlEls, back]
  menu.append(...itemElements);
  return menu;
}

function createControlItem(control: string) {
  const itemEl = document.createElement('div');
  itemEl.innerText = control
  itemEl.className = "control-item";
  return itemEl;

}

interface LevelOption {
  name: string;
  disabled: boolean;
  onClick: Fn
}

function createLevelsContent(onBack: Fn, numOfLevels: number, reachedLevel: number, goToLevel: GoToLevelFn) {
  const menu = document.createElement('div');
  menu.id = 'menu';
  const title = createMenuTitle('Levels')
  const back = createMenuButton('< Back', onBack);
  const levels: LevelOption[] = [];
  callTimes(numOfLevels, (i: number) => {
    // TODO: Have names for the levels?
    levels.push({
      name: `Level ${i}`,
      disabled: reachedLevel < i,
      onClick: () => goToLevel(i)
    });
  })
  const levelEls = levels.map(level => createLevelElement(level))

  const itemElements = [title, ...levelEls, back]

  menu.append(...itemElements);
  return menu;
}


function createLevelElement(level: LevelOption) {
  const itemEl = document.createElement('button');
  itemEl.innerText = level.name;
  itemEl.disabled = level.disabled;
  itemEl.className = "menu-item level-item";
  itemEl.addEventListener('click', level.onClick);
  return itemEl;
}