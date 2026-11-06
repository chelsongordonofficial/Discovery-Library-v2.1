export default function GradientText({
  children,
  className = '',
  colors = ['#FFC83A', '#FF9E2C', '#FFE17D', '#FFC83A'],
  animationSpeed = 6,
  showBorder = false,
  style = {},
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
    ...style,
  };

  return (
    <span className={`animated-gradient-text ${className}`} style={gradientStyle}>
      {children}
    </span>
  );
}
