import { _baseSize, _containerWidth } from "./_vars";
import addHeader from "./addHeader";
import hexToRgb from "./hexToRgb";


const getReportGroup = async ({name, count}) => {
    const container = figma.createFrame();
    container.name = name;
    container.layoutMode = "VERTICAL";
    container.layoutAlign = "STRETCH";
    container.primaryAxisSizingMode = "AUTO";
    container.counterAxisSizingMode = "FIXED";
    container.paddingTop = _baseSize * 2;
    container.paddingBottom = _baseSize * 2;
    container.paddingLeft = _baseSize * 2;
    container.paddingRight = _baseSize * 2;
    container.cornerRadius = 8;
    container.minWidth = _containerWidth;
    container.fills = [
        {
            type: "SOLID",
            color: hexToRgb("#fff"),
        },
    ];

    container.appendChild(await addHeader({ title: name, count }));

    return container;
}

export default getReportGroup;