# Particle Componentinin Ayarları      
### Partikül büyüklüğü için bu satırdaki değer değiştirilmeli, +1 olmasının nedeni 0 büyüklüğünde bir partikül oluşturmaması için
    this.size = Math.random() * 25 + 1;

### Partiküllerin x ve y kordinatlarındaki hareket hızlarını ayarlamak için bu kısımda değişiklik yapılabilir. Öeneğin speedX i arttırmak partikülün x ekseninda daha hızlı hareket deceğini, y ekseninde daha yavaş hareket edeceğini gösterir.
      this.speedX = Math.random() * 8 -1.5;
      this.speedY = Math.random() * 8 -1.5;


### Her bir tıklama ve mouse hareketinde ortaya çıkan partikül sayısını değiştirmek için döngüdeki sınırı arttırabilirsiniz.
    const handleClick = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
      for (let i = 0; i < 10; i++) {
        particlesArray.push(new Particle());
      }
    };
### Ayrıca diğer döngüdeki sınırıda değiştirmeniz lazım

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
      for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle());
      }
    };


### Ağlanmayı arttırma veya azaltma için buradaki sınırı ayarlayabilirsiniz, eğer 150 ise kendinden 150 pixel uzakliktaki partiküle bağlanacaktır bu sınır ne kadar arttılırsa o kadar çok ağlanma olur

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = particlesArray[i].color;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
            ctx.closePath();
          }

### Partiküllerin kaybolması buradakisınıra göre gerçekleşir, boyutu 0.2 nin altına inen partiküller diziden silinir
        if (particlesArray[i].size <= 0.2) {
          particlesArray.splice(i, 1);
          i--;
        }

### Buradaki hue değeri rengi temsil eder renk değişimini burayla oynayarak ayarlayabilirsiniz ve ayrıca arka plan rengini de ctx.fillStyle parametresine atama yaparak değiştirebilirsiniz

    const animate = () => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      handleParticles();
      hue += 2;

      requestAnimationFrame(animate);
    };
