<script lang="ts">
    import {Mixins, Component, Prop} from "vue-property-decorator";
    import {Pie, mixins} from "vue-chartjs";
    import * as Chart from "chart.js";

    @Component
    export default class extends Mixins(Pie, mixins.reactiveProp) {
        @Prop() public chartData: Chart.ChartData;
        @Prop() public chartOptions: Chart.ChartOptions;

        public mounted() {
            this.renderChart(this.chartData, this.chartOptions);
        }
    }
</script>
