const deviceButtons = [...document.querySelectorAll('[data-device]')];
deviceButtons.forEach(button => button.addEventListener('click', () => {
  const mobile = button.dataset.device === 'mobile';
  deviceButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('.p-desktop').forEach(image => { image.hidden = mobile; });
  document.querySelectorAll('.p-mobile').forEach(image => { image.hidden = !mobile; });
  document.querySelector('#device-status').textContent = `Showing ${mobile ? 'phone' : 'desktop'} previews`;
}));
