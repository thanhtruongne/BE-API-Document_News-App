import { getValuesFromTree } from "../../../../utils/index.utils.js";

const getDataContentPage = async(query, categoriesRepository, postRepository, postService) =>  {
    const payloadCategory = await categoriesRepository.getTreeData(query, {status: 'Active'});
    const generateIDCate = getValuesFromTree(payloadCategory);

    const [contentData, sidebar, high_view] = await Promise.all([
     
        (async () => {
            if (!Array.isArray(generateIDCate['result']) || generateIDCate['result'].length === 0) {
                return [];
            }

            try {
                const promiseData = await Promise.all(
                    generateIDCate['result'].map(async (item, index) => {
                        const result = await postRepository.findByQuery({
                            categories_id: { $in: item },
                            limit: 8,
                            select: '-content',
                            sort: { createdAt: -1 }
                        });
                        
                        return result && result.length > 0 ? {
                            slug: generateIDCate['slug'][index],
                            result,
                            name: generateIDCate['name'][index]
                        } : null;
                    })
                );
                return promiseData.filter(item => item !== null);
            } catch (error) {
                console.error("Error fetching content data:", error);
                return [];
            }
        })(),
        // Sidebar data
        postRepository.findByQuery({
            sort: { createdAt: 1 }, 
            limit: 8,
            status: 'Active',
            select: '-content'
        }),
        // High view data
        postRepository.findByQuery({
            sort: { viewed: 1 }, 
            limit: 3,
            status: 'Active',
            select: '-content'
        })
    ]);

    // Find topic content
    const index_topic_id = generateIDCate['slug'].findIndex(
        group => group.some(item => item.includes("goc-nhin"))
    );

    const topic = index_topic_id !== -1 ? await postRepository.findByQuery({
        sort: { createdAt: 1 },
        select: '-content',
        limit: 1,
        status: 'Active',
        categories_id: { $in: generateIDCate['result'][index_topic_id] }
    }) : [];

    return {
        response: contentData,
        sidebar,
        high_view,
        topic_content: {
            name: index_topic_id !== -1 ? generateIDCate['name'][index_topic_id][0] : null,
            topic: topic && topic.length > 0 ? topic[0] : null
        }
    };
}

export default getDataContentPage;  



    