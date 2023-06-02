import { readFileSync } from 'fs';
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  A simple function that combines all other functions into one command            //
//  Input: The folder of map files and the list of MAP000 files                     //
//  Output: A 2D array of all the scraped data                                      //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const ScrapeAll = (folder_path, matching_files) => {
    let scraped_messages = [];
    let scraped_commands = [];
    let scraped_terms = [];
    let scraped_custom = [];
    scraped_messages = ScrapeMessages(folder_path, matching_files);
    scraped_commands = ScrapeCommands(folder_path, matching_files);
    scraped_custom = ScrapeMapNames(folder_path);
    return [scraped_messages, scraped_commands, scraped_terms, scraped_custom];
};
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Looks for items with the 401 code, which are the dialogue messages              //
//  Concatenates them into a single string separated by \n for multi-line messages  //
//  Input: The folder of map files and the list of MAP000 files                     //
//  Output: An array of all the dialogue messages                                   //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const ScrapeMessages = (folder_path, matching_files) => {
    const concatMessages = (item, concatMessage) => {
        if (item.parameters && item.parameters.length > 0) {
            const parameter = item.parameters[0].trim();
            if (concatMessage !== "") {
                return `${concatMessage}\n${parameter}`;
            }
            else {
                return parameter;
            }
        }
        return concatMessage;
    };
    const scraped_messages = [];
    matching_files.forEach((file) => {
        const fileJson = JSON.parse(readFileSync(`${folder_path}/${file}`, 'utf8'));
        let concat_message = "";
        fileJson.events.forEach((event) => {
            if (event && event.pages) {
                event.pages.forEach((page) => {
                    if (page && page.list) {
                        page.list.forEach((item, index) => {
                            if (item.code === 401) {
                                concat_message = concatMessages(item, concat_message);
                            }
                            else if (concat_message !== "") {
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
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Looks for items with the 102 code, which are the selectable options             //
//  Input: The folder of map files and the list of MAP000 files                     //
//  Output: An array of all the dialogue options                                    //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const ScrapeCommands = (folder_path, matching_files) => {
    const scraped_commands = [];
    matching_files.forEach((file) => {
        const fileJson = JSON.parse(readFileSync(`${folder_path}/${file}`, 'utf8'));
        fileJson.events.forEach((event) => {
            if (event && event.pages) {
                event.pages.forEach((page) => {
                    if (page && page.list) {
                        page.list.forEach((item) => {
                            if (item.code === 102 && Array.isArray(item.parameters) && Array.isArray(item.parameters[0])) {
                                item.parameters[0].forEach((param) => {
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
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
//  Scrapes MapInfos.JSON folder which contains all level names in the game         //
//  Input: The folder that contains the MapInfos.json file                          //
//  Output: An array of all the map names                                           //
// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+//
export const ScrapeMapNames = (folder_path) => {
    try {
        const map_data = JSON.parse(readFileSync(`${folder_path}/MapInfos.json`, 'utf8'));
        return Array.isArray(map_data) ? map_data.filter(item => item && typeof item === 'object' && 'name' in item).map(item => item.name) : [];
    }
    catch (err) {
        console.error(err);
        return [];
    }
};
//# sourceMappingURL=ScrapeFunctions.js.map