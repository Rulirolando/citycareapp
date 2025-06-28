import CustomMap from "../utils/map";

export async function  reportMapper(report) {
    return {
        ...report, 
        location: {
            ...report.location, 
            placeName: await CustomMap.getPlaceNameByCoordinate(report.location.latitude, report.location.longitude),
        }
    }
}