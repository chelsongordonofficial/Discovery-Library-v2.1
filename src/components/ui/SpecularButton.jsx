import { useEffect, useRef } from 'react';
import './SpecularButton.css';

const PAD = 24;

/**
 * React Bits Specular Button Component (https://reactbits.dev/components/specular-button)
 * Adds pointer-tracking specular rim light that catches and sweeps across button edges.
 * Translates and backglow are removed, preserving native background, fonts, and colors.
 */
function SpecularButton({
  as: Tag = 'button',
  children,
  radius = 12,
  lineColor = '#ffffff',
  baseColor = '#ffd860',
  intensity = 1.2,
  idleIntensity = 0.35,
  proximity = 280,
  followMouse = true,
  autoAnimate = false,
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const button = canvas.parentElement;
    if (!button) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = button.offsetWidth || 140;
    let height = button.offsetHeight || 44;
    let ratio = Math.min(window.devicePixelRatio || 1, 2);

    const updateSize = () => {
      width = button.offsetWidth || 140;
      height = button.offsetHeight || 44;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (width + PAD * 2) * ratio;
      canvas.height = (height + PAD * 2) * ratio;
      canvas.style.width = `${width + PAD * 2}px`;
      canvas.style.height = `${height + PAD * 2}px`;
    };
    updateSize();

    // Default rest angle (top-left rim highlight)
    const restAngle = -Math.PI * 0.65;
    let curAngle = restAngle;
    let targetAngle = restAngle;
    let curLevel = idleIntensity;
    let targetLevel = idleIntensity;
    let pressLevel = 0;
    let lastTime = performance.now();

    const pointer = { x: 0, y: 0, known: false };

    let isVisible = true;
    let needsDraw = true;
    let cachedRect = null;

    const invalidateRect = () => {
      cachedRect = null;
    };

    const scheduleFrame = () => {
      if (!animRef.current && isVisible) {
        lastTime = performance.now();
        animRef.current = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.known = true;
      needsDraw = true;
      scheduleFrame();
    };

    const onPointerLeave = () => {
      pointer.known = false;
      needsDraw = true;
      scheduleFrame();
    };

    const onPointerDown = () => {
      if (!disabled) {
        pressLevel = 1;
        needsDraw = true;
        scheduleFrame();
      }
    };

    const onScrollOrResize = () => {
      cachedRect = null;
      if (pointer.known && isVisible) {
        needsDraw = true;
        scheduleFrame();
      }
    };

    // Calculate intersection on rounded rectangle rim
    const getRimCoordinates = (angle, halfW, halfH, r) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const innerW = halfW - r;
      const innerH = halfH - r;

      const scale = Math.min(
        Math.abs(cos) > 0.0001 ? halfW / Math.abs(cos) : Infinity,
        Math.abs(sin) > 0.0001 ? halfH / Math.abs(sin) : Infinity
      );

      let x = Math.max(-halfW, Math.min(halfW, cos * scale));
      let y = Math.max(-halfH, Math.min(halfH, sin * scale));

      if (Math.abs(x) > innerW && Math.abs(y) > innerH) {
        const cx = Math.sign(x) * innerW;
        const cy = Math.sign(y) * innerH;
        const cornerAngle = Math.atan2(y - cy, x - cx);
        x = cx + Math.cos(cornerAngle) * r;
        y = cy + Math.sin(cornerAngle) * r;
      }

      return [x, y];
    };

    const drawPath = (c, x, y, w, h, r) => {
      c.beginPath();
      if (c.roundRect) {
        c.roundRect(x, y, w, h, r);
      } else {
        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.arcTo(x + w, y, x + w, y + r, r);
        c.lineTo(x + w, y + h - r);
        c.arcTo(x + w, y + h, x + w - r, y + h, r);
        c.lineTo(x + r, y + h);
        c.arcTo(x, y + h, x, y + h - r, r);
        c.lineTo(x, y + r);
        c.arcTo(x, y, x + r, y, r);
        c.closePath();
      }
    };

    const render = (time) => {
      animRef.current = 0;
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (followMouse && pointer.known) {
        if (!cachedRect) {
          cachedRect = button.getBoundingClientRect();
        }
        const centerX = cachedRect.left + cachedRect.width / 2;
        const centerY = cachedRect.top + cachedRect.height / 2;
        const dx = pointer.x - centerX;
        const dy = pointer.y - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist <= proximity) {
          targetAngle = Math.atan2(dy, dx);
          const t = Math.max(0, 1 - dist / proximity);
          targetLevel = idleIntensity + (1 - idleIntensity) * (t * t * (3 - 2 * t));
        } else {
          targetAngle = restAngle;
          targetLevel = idleIntensity;
        }
      } else if (autoAnimate) {
        targetAngle += dt * 0.8;
        targetLevel = idleIntensity;
      } else {
        targetAngle = restAngle;
        targetLevel = idleIntensity;
      }

      // Smooth shortest-path angle lerp
      let diff = targetAngle - curAngle;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const levelDiff = targetLevel - curLevel;

      curAngle += diff * (1 - Math.exp(-dt * 9));
      curLevel += levelDiff * (1 - Math.exp(-dt * 7));
      pressLevel *= Math.exp(-dt * 6);

      const isSettled =
        !autoAnimate &&
        Math.abs(diff) < 0.001 &&
        Math.abs(levelDiff) < 0.001 &&
        pressLevel < 0.002;

      if (isSettled) {
        curAngle = targetAngle;
        curLevel = targetLevel;
        pressLevel = 0;
      }

      if (needsDraw || !isSettled || autoAnimate) {
        needsDraw = false;

        // Canvas clear & coordinate transform
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(ratio, ratio);

        const r = Math.min(radius, width / 2, height / 2);
        const halfW = width / 2;
        const halfH = height / 2;
        const [rimX, rimY] = getRimCoordinates(curAngle, halfW, halfH, r);
        const spotX = PAD + halfW + rimX;
        const spotY = PAD + halfH + rimY;

        // 1. Subtle hairline border outline
        ctx.save();
        drawPath(ctx, PAD + 0.5, PAD + 0.5, width - 1, height - 1, r);
        ctx.lineWidth = 1;
        const isGreen =
          typeof baseColor === 'string' &&
          (baseColor.toLowerCase().includes('19d68a') ||
            baseColor.toLowerCase().includes('green') ||
            baseColor.toLowerCase().includes('em'));
        ctx.strokeStyle = isGreen ? 'rgba(25, 214, 138, 0.35)' : 'rgba(255, 216, 96, 0.35)';
        ctx.stroke();
        ctx.restore();

        // 2. Specular radial gradient highlight centered on the rim point
        const effectiveIntensity = intensity * (curLevel + pressLevel * 0.9);
        const spotRadius = Math.max(width * 0.38, 55);
        const grad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotRadius);

        const a1 = Math.min(1, 0.98 * effectiveIntensity);
        const a2 = Math.min(1, 0.72 * effectiveIntensity);
        const a3 = Math.min(1, 0.32 * effectiveIntensity);

        if (isGreen) {
          grad.addColorStop(0, `rgba(255, 255, 255, ${a1})`);
          grad.addColorStop(0.2, `rgba(180, 255, 225, ${a2})`);
          grad.addColorStop(0.55, `rgba(25, 214, 138, ${a3})`);
          grad.addColorStop(1, 'rgba(25, 214, 138, 0)');
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${a1})`);
          grad.addColorStop(0.2, `rgba(255, 244, 200, ${a2})`);
          grad.addColorStop(0.55, `rgba(255, 200, 58, ${a3})`);
          grad.addColorStop(1, 'rgba(255, 200, 58, 0)');
        }

        // 3. Specular ambient halo (glow)
        ctx.save();
        drawPath(ctx, PAD + 0.5, PAD + 0.5, width - 1, height - 1, r);
        ctx.lineWidth = 4;
        ctx.strokeStyle = grad;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
        ctx.shadowBlur = 8 * curLevel;
        ctx.stroke();
        ctx.restore();

        // 4. Sharp crisp specular rim light beam
        ctx.save();
        drawPath(ctx, PAD + 0.5, PAD + 0.5, width - 1, height - 1, r);
        ctx.lineWidth = 2;
        ctx.strokeStyle = grad;
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      if (!isSettled || autoAnimate) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              isVisible = Boolean(entry?.isIntersecting);
              invalidateRect();
              if (isVisible) {
                needsDraw = true;
                scheduleFrame();
              } else if (animRef.current) {
                cancelAnimationFrame(animRef.current);
                animRef.current = 0;
              }
            },
            { rootMargin: '80px 0px' }
          )
        : null;
    if (io) io.observe(button);

    scheduleFrame();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    button.addEventListener('pointerdown', onPointerDown);

    const ro = new ResizeObserver(() => {
      updateSize();
      invalidateRect();
      needsDraw = true;
      scheduleFrame();
    });
    ro.observe(button);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (io) io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScrollOrResize);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      button.removeEventListener('pointerdown', onPointerDown);
      ro.disconnect();
    };
  }, [radius, lineColor, baseColor, intensity, idleIntensity, proximity, followMouse, autoAnimate, disabled]);

  const nativeProps = Tag === 'button' ? { type: 'button', disabled } : {};

  return (
    <Tag
      {...nativeProps}
      className={`specular-button${className ? ` ${className}` : ''}`}
      onClick={onClick}
      {...rest}
    >
      <canvas ref={canvasRef} className="specular-button__light" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </Tag>
  );
}

export default SpecularButton;
