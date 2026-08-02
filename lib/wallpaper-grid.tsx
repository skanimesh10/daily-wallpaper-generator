type WallpaperGridProps = {
  width: number;
  height: number;
  totalDays: number;
  daysPassed: number;
  headerText: string;
  subtitleText?: string;
  daysLeft: number;
  percentage: number;
  accentColor: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Approximate how many characters fit on one line at a given font size. */
function truncateToWidth(
  text: string,
  maxWidthPx: number,
  fontSizePx: number,
): string {
  const avgCharWidth = fontSizePx * 0.55;
  const maxChars = Math.max(8, Math.floor(maxWidthPx / avgCharWidth));
  if (text.length <= maxChars) return text;
  if (maxChars <= 3) return text.slice(0, maxChars);
  return `${text.slice(0, maxChars - 1).trimEnd()}…`;
}

/**
 * Scale fonts from the shorter canvas edge so landscape desktop
 * presets don't produce huge text that overlaps the dot grid.
 */
function fitFontSize(
  width: number,
  height: number,
  widthRatio: number,
  heightRatio: number,
  minPx: number,
  maxPx: number,
): number {
  return clamp(
    Math.floor(Math.min(width * widthRatio, height * heightRatio)),
    minPx,
    maxPx,
  );
}

export function WallpaperGrid({
  width,
  height,
  totalDays,
  daysPassed,
  headerText,
  subtitleText,
  daysLeft,
  percentage,
  accentColor,
}: WallpaperGridProps) {
  const isLandscape = width > height;
  const cols = isLandscape
    ? Math.min(30, Math.max(15, Math.ceil(Math.sqrt(totalDays * (width / height)))))
    : 15;
  const rows = Math.ceil(totalDays / cols);

  // Dedicated bands so text never shares space with dots.
  const headerBand = height * (isLandscape ? 0.16 : 0.2);
  const footerBand = height * (isLandscape ? 0.12 : 0.1);
  const sidePad = width * (isLandscape ? 0.06 : 0.1);
  const gridGapTop = height * 0.02;
  const gridGapBottom = height * 0.02;

  const gridAreaTop = headerBand + gridGapTop;
  const gridAreaBottom = height - footerBand - gridGapBottom;
  const availableWidth = width - sidePad * 2;
  const availableHeight = Math.max(gridAreaBottom - gridAreaTop, 1);

  const dotSpacing = Math.min(availableWidth / cols, availableHeight / rows);
  const dotSize = dotSpacing * 0.65;

  const gridWidth = cols * dotSpacing;
  const gridHeight = rows * dotSpacing;

  const startX = (width - gridWidth) / 2 + dotSpacing / 2;
  const startY = gridAreaTop + (availableHeight - gridHeight) / 2;

  const textMaxWidth = Math.min(gridWidth, width - sidePad * 2);

  const headerFontSize = fitFontSize(
    width,
    height,
    isLandscape ? 0.014 : 0.022,
    isLandscape ? 0.04 : 0.028,
    14,
    Math.floor(headerBand * (subtitleText ? 0.28 : 0.36)),
  );
  const subtitleFontSize = fitFontSize(
    width,
    height,
    isLandscape ? 0.01 : 0.018,
    isLandscape ? 0.028 : 0.022,
    12,
    Math.floor(headerBand * 0.22),
  );
  const footerFontSize = fitFontSize(
    width,
    height,
    isLandscape ? 0.016 : 0.032,
    isLandscape ? 0.045 : 0.036,
    14,
    Math.floor(footerBand * 0.45),
  );

  const headerBlockHeight = subtitleText
    ? headerFontSize + 8 + subtitleFontSize
    : headerFontSize;
  const headerTop = Math.max(
    (headerBand - headerBlockHeight) / 2,
    height * 0.02,
  );

  const safeHeaderText = truncateToWidth(
    headerText,
    textMaxWidth,
    headerFontSize,
  );
  const safeSubtitleText = subtitleText
    ? truncateToWidth(subtitleText, textMaxWidth, subtitleFontSize)
    : undefined;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#121214",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header band — clipped so text cannot reach the dots */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height: headerBand,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            marginTop: headerTop,
            width: textMaxWidth,
            maxWidth: textMaxWidth,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: textMaxWidth,
              color: accentColor,
              fontSize: headerFontSize,
              lineHeight: 1.2,
              textAlign: "center",
              overflow: "hidden",
              maxHeight: subtitleText
                ? headerFontSize * 1.2 * 2
                : headerFontSize * 1.2 * 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: accentColor,
                fontSize: headerFontSize,
                lineHeight: 1.2,
                textAlign: "center",
                maxWidth: textMaxWidth,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {safeHeaderText}
            </span>
          </div>
          {safeSubtitleText ? (
            <span
              style={{
                color: "#6b7280",
                fontSize: subtitleFontSize,
                lineHeight: 1.2,
                marginTop: 8,
                textAlign: "center",
                maxWidth: textMaxWidth,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {safeSubtitleText}
            </span>
          ) : null}
        </div>
      </div>

      {/* Dot grid — only inside the middle band */}
      {Array.from({ length: totalDays }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * dotSpacing;
        const y = startY + row * dotSpacing;

        const isToday = daysPassed > 0 && i === daysPassed - 1;
        const isPassed = daysPassed > 0 && i < daysPassed - 1;

        let bgColor = "#3a3a3c";
        if (isToday) {
          bgColor = accentColor;
        } else if (isPassed) {
          bgColor = "#ffffff";
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - dotSize / 2,
              top: y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: bgColor,
            }}
          />
        );
      })}

      {/* Footer band — clipped below the grid */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width,
          height: footerBand,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <span style={{ color: accentColor, fontSize: footerFontSize }}>
          {daysLeft}d left
        </span>
        <span
          style={{
            color: "#6b7280",
            fontSize: footerFontSize,
            marginLeft: 12,
            marginRight: 12,
          }}
        >
          ·
        </span>
        <span style={{ color: "#6b7280", fontSize: footerFontSize }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}
