function filterMochi(category) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const isMatch = category === 'all' || card.dataset.category === category;
    card.style.display = isMatch ? 'block' : 'none';
  });
}
