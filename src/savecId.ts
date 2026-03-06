const savedId = ({id, node}:{id?: string, node: any}) => {
    const savedId = node.getPluginData("savedId");

    if (savedId) {
        return savedId;
    } else {
        node.setPluginData("savedId", id);
        return id;
    }
}

export default savedId;