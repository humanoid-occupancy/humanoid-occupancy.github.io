/**
 * 初始化所有交互组件
 */
document.addEventListener('DOMContentLoaded', () => {
  // ==================== 导航栏菜单 ====================
  const navbarBurgers = Array.from(document.querySelectorAll('.navbar-burger'));

  navbarBurgers.forEach(burger => {
    burger.addEventListener('click', () => {
      const targetId = burger.dataset.target;
      const targetMenu = document.getElementById(targetId);
      
      // 切换激活状态
      burger.classList.toggle('is-active');
      targetMenu.classList.toggle('is-active');
      
      // 移动端专用：菜单展开时禁止页面滚动
      if (window.innerWidth < 1024) {
        document.body.style.overflow = 
          targetMenu.classList.contains('is-active') ? 'hidden' : '';
      }
    });
  });

  // ==================== 轮播组件 ====================
  if (typeof bulmaCarousel !== 'undefined') {
    const carousels = bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
      breakpoints: [
        { changePoint: 768, slidesToShow: 1 }, // 移动端单列显示
        { changePoint: 1024, slidesToShow: 2 }  // 平板双列显示
      ]
    });

    // 调试用：打印轮播状态
    carousels.forEach(carousel => {
      carousel.on('before:show', state => {
        console.debug('Carousel state:', state);
      });
    });
  }

  // ==================== 滑动组件 ====================
  if (typeof bulmaSlider !== 'undefined') {
    bulmaSlider.attach();
  }

  // ==================== 图片预加载 ====================
  const INTERP_BASE = "./static/interpolation/stacked";
  const NUM_INTERP_FRAMES = 240;
  const interpImages = [];

  function preloadInterpolationImages() {
    for (let i = 0; i < NUM_INTERP_FRAMES; i++) {
      const path = `${INTERP_BASE}/${String(i).padStart(6, '0')}.jpg`;
      interpImages[i] = new Image();
      interpImages[i].src = path;
      // 禁用图片拖拽和右键菜单
      interpImages[i].ondragstart = () => false;
      interpImages[i].oncontextmenu = () => false;
    }
  }

  function setInterpolationImage(index) {
    const wrapper = document.getElementById('interpolation-image-wrapper');
    if (wrapper && interpImages[index]) {
      wrapper.innerHTML = '';
      wrapper.appendChild(interpImages[index]);
    }
  }

  // 按需启用预加载
  if (document.getElementById('interpolation-slider')) {
    preloadInterpolationImages();
    document.getElementById('interpolation-slider').addEventListener('input', (e) => {
      setInterpolationImage(e.target.value);
    });
    // 初始化显示第一帧
    setInterpolationImage(0);
  }
});

/**
 * 视频播放器辅助功能
 */
if (typeof videojs !== 'undefined') {
  window.HELP_IMPROVE_VIDEOJS = false;
  
  const player = videojs('interpolation-video');
  player.ready(() => {
    const slider = document.getElementById('interpolation-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        player.currentTime = player.duration() * (e.target.value / 100);
      });
    }
  });
}