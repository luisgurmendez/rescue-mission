
interface MenuItem {
  label: string;
  onClick: () => void;
}

function noop() { }

type Fn = () => void;

export function createMenu(onResume: Fn) {
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

  const menu = createMenuContent(onResume, changeMenuPage);
  const controls = createControlsContent(onBack)
  const levels = createLevelsContent(onBack);
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
    { label: 'Landing rocket', onClick: () => onChangePage(3) },
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
  const back = createMenuButton('< Back', onBack);
  const itemElements = [title, back]
  menu.append(...itemElements);
  return menu;
}

function createLevelsContent(onBack: Fn) {
  const menu = document.createElement('div');
  menu.id = 'menu';
  const title = createMenuTitle('Levels')
  const back = createMenuButton('< Back', onBack);
  const itemElements = [title, back]
  menu.append(...itemElements);
  return menu;
}
