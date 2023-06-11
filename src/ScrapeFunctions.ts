const { readFileSync, readdirSync } = require('fs');

const getMatchingFiles = () => {
    return readdirSync(`${globalThis.project_path}/data/`).filter((file : any) => file.match(/^Map\d{3}\.json$/));
};

// Wrapped function to scrape all data from the project
export const ScrapeAll = () => {
    const scraped_terms: string[] = []; 
    return [ScrapeMessages(), ScrapeCommands(), scraped_terms, ScrapeMapNames()];
};


//  Scrapes items with the 401 code, which are the dialogue messages and
//  Concatenates grouped messages into one string separated by a newline
export const ScrapeMessages = () => {
    const concatMessages = (item: any, concatMessage: string) => {
        if (item.parameters && item.parameters.length > 0) {
            const parameter = item.parameters[0].trim();
            if (concatMessage !== "") {
                return `${concatMessage}\n${parameter}`;
            } else {
                return parameter;
            }
        }
        return concatMessage;
    };

    const scraped_messages: string[] = [];
    const matching_files = getMatchingFiles();

    matching_files.forEach((file: string) => {
        const fileJson = JSON.parse(readFileSync(`${globalThis.project_path}/data/${file}`, 'utf8'));
        let concat_message = "";

        fileJson.events.forEach((event: any) => {
            if (event && event.pages) {
                event.pages.forEach((page: any) => {
                    if (page && page.list) {
                        page.list.forEach((item: any, index: number) => {
                            if (item.code === 401) {
                                concat_message = concatMessages(item, concat_message);
                            } else if (concat_message !== "") {
                                scraped_messages.push(concat_message);
                                concat_message = "";
                            }
                            if (index === page.list.length - 1 && concat_message !== "") {
                                scraped_messages.push(concat_message);
                                concat_message = "";
                            }
                        });
                    }
                });
            }
        });
    });
    return scraped_messages;
};


// Scrapes items with the 102 code, which are the menu options
export const ScrapeCommands = () => {

    const scraped_commands: string[] = [];
    const matching_files = getMatchingFiles();

    matching_files.forEach((file: string) => {
        const fileJson = JSON.parse(readFileSync(`${globalThis.project_path}/data/${file}`, 'utf8'));

        fileJson.events.forEach((event: any) => {
            if (event && event.pages) {
                event.pages.forEach((page: any) => {
                    if (page && page.list) {
                        page.list.forEach((item: any) => {
                            if (item.code === 102 && Array.isArray(item.parameters) && Array.isArray(item.parameters[0])) {
                                item.parameters[0].forEach((param: any) => {
                                    if (typeof param === 'string') {
                                        scraped_commands.push(param);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    return scraped_commands;
};

//  Scrapes MapInfos.JSON from the project_path which contains all level names in the game
export const ScrapeMapNames = (): string[] => {
    try {
        const map_data = JSON.parse(readFileSync(`${globalThis.project_path}/data/MapInfos.json`, 'utf8'));
        return Array.isArray(map_data) ? map_data.filter(item => item && typeof item === 'object' && 'name' in item).map(item => item.name) : [];
    } catch (err) {
        console.error(err);
        return [];
    }
};
