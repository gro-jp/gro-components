const templateComboChart = document.createElement('template');
templateComboChart.innerHTML = `
<style>
:host {
    display: block;
}
:host([hidden]) {
    display: none 
}
</style>
<div></div>
`;

class ComboChart extends HTMLElement {

    #uri;
    #param1;
    #param2;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateComboChart.content.cloneNode(true));
    }

    async connectedCallback() {
        document.addEventListener('params-changed', e => {
            this.setAttribute('param1', e.detail.param1);
            this.setAttribute('param2', e.detail.param2);
            this.renderChart();
        });
        await google.charts.load('current', {'packages':['corechart']});
        await this.renderChart();
    }

    static get observedAttributes() {
        return ['uri', 'param1', 'param2'];
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'uri':
                this.#uri = newValue;
                break;
            case 'param1':
                this.#param1 = newValue;
                break;
            case 'param2':
                this.#param2 = newValue;
                break;
        }
    }


    async renderChart() {
        await google.charts.load('current', {'packages':['corechart']});

        const data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'delta');
        data.addColumn('number', 'average');
        data.addColumn('number', 'minimum');
        data.addColumn('number', 'maximum');
        data.addColumn('number', 'total');

        data.addRows([
            [new Date("2022-05-24"),(2.019145 - 1.397103), 1.708124,1.397103,2.019145,2],
            [new Date("2022-05-26"),(2.519145 - 1.997103), 1.08124,1.997103,2.519145,2],
            [new Date("2022-05-28"),(2.019145 - 1.197103), 1.908124,1.197103,2.019145,2],
            [new Date("2022-05-31"),(0.799 - 0.125), 0.3390000000000001,0.125,0.799,5],
            [new Date("2022-06-13"),(2.378 - 1.281), 0.3295,0.281,0.378,2]
        ]);



        const chart = new google.visualization.ComboChart(this.shadowRoot.querySelector('div'));

        const options = {
            //height: 600,
            //width: 1500,
            seriesType: 'bars',
            isStacked: true,
            series: {
                0: { type: 'bars', color: 'white', enableInteractivity: false },
                1: { type: 'bars', color: '#a855f7' },
                2: { type: 'line', color: '#0000e6', lineWidth: 3 },
                3: { type: 'line', color: '#0891b2', lineWidth: 3 },
                4: { type: 'line', color: '#fb7185', lineWidth: 3 }
            },
            hAxis: {
                gridlines: { count: 12, color: 'white' }
                //format: 'date'
            },
            vAxis: { gridlines: { count: 6, color: 'white' } },
            legend: 'top'
        };
        await chart.draw(data, options);
    }

}

customElements.define('combo-chart', ComboChart);
