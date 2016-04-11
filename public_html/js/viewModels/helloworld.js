define(['ojs/ojcore', 'knockout', 'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojbutton','promise', 'ojs/ojtable'
], function (oj, ko) {
    function homeContentViewModel() {
        var self = this;
        this.url = ko.observable("ws://localhost:8080/lightfish/snapshots/json/");
        self.connect = function (data) {
            websocket = new WebSocket(data.url());
            websocket.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                self.updateChart(data);
            };
        };
        var heapSeries = [{name: "heap", items: []}];
        this.heapSize = ko.observableArray(heapSeries);
        var threadCountSeries = [{name: "threadCount", items: []}];
        this.threadCount = ko.observableArray(threadCountSeries);
        var peakThreadCountSeries = [{name: "peakThreadCount", items: []}];
        this.peakThreadCount = ko.observableArray(peakThreadCountSeries);
        var groups = [];
        this.time = ko.observableArray(groups);
        var snapshots = [{dummy: 0}];
        self.data = new oj.ArrayTableDataSource(snapshots, {idAttribute: 'id'});
        self.data.remove(self.data.at(0));
        self.updateChart = function (data) {
            self.data.add(data.snapshot);
            if (heapSeries[0].items.length > 100) {
                heapSeries[0].items.shift();
                threadCountSeries[0].items.shift();
                peakThreadCountSeries[0].items.shift();
                groups.shift();
            }
            groups.push(data.snapshot.monitoringTime);
            self.time(groups);
            heapSeries[0].items.push(parseFloat(data.snapshot.usedHeapSize));
            self.heapSize(heapSeries);
            threadCountSeries[0].items.push(data.snapshot.threadCount);
            self.threadCount(threadCountSeries);
            peakThreadCountSeries[0].items.push(data.snapshot.peakThreadCount);
            self.peakThreadCount(peakThreadCountSeries);
        };
    }
    return new homeContentViewModel();
});


