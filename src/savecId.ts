const savedId = ({id, node}:{id?: string, node: any}) => {
    const savedId = node.getSharedPluginData("StatusReporter", "savedId");

    if (savedId) {
        return savedId;
    } else {
        node.setSharedPluginData("StatusReporter", "savedId", id);
        return id;
    }
}

export default savedId;