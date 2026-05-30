
import individualFrame from "@/assets/services/individual.png";
import coupleFrame from "@/assets/services/duo.png";
import conferencesFrame from "@/assets/services/conferences.png";
import workshopsFrame from "@/assets/services/workshops.png";
import webinarsFrame from "@/assets/services/webinars.png";
import consultingFrame from "@/assets/services/consulting.png";
import encountersFrame from "@/assets/services/encounters.png";

import individual_img from "@/assets/services/individual-img1.jpg";
import couple_img from "@/assets/services/duo-img1.jpg";
import conferences_img from "@/assets/services/conferences-img1.png";
import workshops_img from "@/assets/services/workshops-img1.png";
import webinars_img from "@/assets/services/webinars-img1.png";
import consulting_img from "@/assets/services/consulting-img1.jpg";
import encounters_img from "@/assets/services/encounters-img1.webp";





interface Services {
    [key: string]: {
        title: string;
        description: string;
        paragraph_2: string;
        paragraph_3?: string;
        differential: string;
        url: string;
        frame: string;
        img: string
    }
}


export const services: Services = {
    "individual": {
        title: "individual.title",
        description: "individual.description",
        paragraph_2: "individual.paragraph_2",
        differential: "individual.differential",
        url: "/services/individual",
        frame: individualFrame,
        img: individual_img
    },
    "couple": {
        title: "couple.title",
        description: "couple.description",
        paragraph_2: "couple.paragraph_2",
        differential: "couple.differential",
        url: "/services/couple",
        frame: coupleFrame,
        img: couple_img
    },
    "conferences": {
        title: "conferences.title",
        description: "conferences.description",
        paragraph_2: "conferences.paragraph_2",
        differential: "conferences.differential",
        url: "/services/conferences",
        frame: conferencesFrame,
        img: conferences_img
    },
    "workshops": {
        title: "workshops.title",
        description: "workshops.description",
        paragraph_2: "workshops.paragraph_2",
        differential: "workshops.differential",
        url: "/services/workshops",
        frame: workshopsFrame,
        img: workshops_img
    },
    "webinars": {
        title: "webinars.title",
        description: "webinars.description",
        paragraph_2: "webinars.paragraph_2",
        paragraph_3: "webinars.paragraph_3",
        differential: "webinars.differential",
        url: "/services/webinars",
        frame: webinarsFrame,
        img: webinars_img
    },
    "consulting": {
        title: "consulting.title",
        description: "consulting.description",
        paragraph_2: "consulting.paragraph_2",
        differential: "consulting.differential",
        url: "/services/consulting",
        frame: consultingFrame,
        img: consulting_img
    },
    "encounters": {
        title: "encounters.title",
        description: "encounters.description",
        paragraph_2: "encounters.paragraph_2",
        differential: "encounters.differential",
        url: "/services/encounters",
        frame: encountersFrame,
        img: encounters_img

    }
};