L.Control.SliderControl = L.Control.extend({
    options: {
        position: "topright",
        layer: null,
        timeAttribute: "time",
        isEpoch: !1,
        startTimeIdx: 0,
        timeStrLength: 19,
        maxValue: -1,
        minValue: 0,
        showAllOnStart: !1,
        markers: null,
        range: !1,
        follow: 0,
        sameDate: !1,
        alwaysShowDate: !1,
        rezoom: null,
        orderMarkers: !0,
        orderDesc: !1
    },
    initialize: function(e) {
        L.Util.setOptions(this, e), this._layer = this.options.layer, L.extend(this, L.Mixin.Events)
    },
    onAdd: function(e) {
        this.options.map = e, this.container = L.DomUtil.create("div", "", this._container), this.sliderBoxContainer = L.DomUtil.create("div", "slider", this.container);
        var t = L.DomUtil.create("div", "", this.sliderBoxContainer);
        t.id = "leaflet-slider", t.style.width = "200px", L.DomUtil.create("div", "ui-slider-handle", t), this.timestampContainer = L.DomUtil.create("div", "slider", this.container), this.timestampContainer.id = "slider-timestamp", this.timestampContainer.style.cssText = "width:200px; margin-top:3px; background-color:#FFFFFF; text-align:center; border-radius:5px;display:none;", L.DomEvent.disableClickPropagation(this.sliderBoxContainer), this._map.on("mouseup", this.clearTimestamp, this);
        var r = this.options;
        if (this.options.markers = [], this._layer) {
            var i = 0,
                a = [];
            this._layer.eachLayer(function(e) {
                a.push(e)
            }), r.orderMarkers && (a = a.sort(function(e, t) {
                return e.options[r.timeAttribute] < t.options[r.timeAttribute] ? -1 : e.options[r.timeAttribute] > t.options[r.timeAttribute] ? 1 : 0
            }), r.orderDesc && (a = a.reverse())), a.forEach(function(e) {
                r.markers[i] = e, ++i
            }), r.maxValue = i - 1, this.options = r
        } else console.log("Error: You have to specify a layer via new SliderControl({layer: your_layer});");
        return this.container
    },
    onRemove: function(e) {
        for (i = this.options.minValue; i <= this.options.maxValue; i++) e.removeLayer(this.options.markers[i]);
        this.container.remove(), e.off("mouseup", this.clearTimestamp, this)
    },
    startSlider: function() {
        var n = this.options,
            m = this.extractTimestamp,
            e = n.minValue;
        n.showAllOnStart && (e = n.maxValue, n.range ? n.values = [n.minValue, n.maxValue] : n.value = n.maxValue);
        var l = this.timestampContainer,
            u = this;
        $(this.sliderBoxContainer).slider({
            range: n.range,
            value: n.value,
            values: n.values,
            min: n.minValue,
            max: n.maxValue,
            sameDate: n.sameDate,
            step: 1,
            slide: function(e, t) {
                var r = n.map,
                    i = L.featureGroup();
                if (n.markers[t.value]) {
                    void 0 !== n.markers[t.value].feature ? n.markers[t.value].feature.properties[n.timeAttribute] ? n.markers[t.value] && (l.style.display = "block", $(l).html(m(n.markers[t.value].feature.properties[n.timeAttribute], n))) : console.error("Time property " + n.timeAttribute + " not found in data") : n.markers[t.value].options[n.timeAttribute] ? n.markers[t.value] && (l.style.display = "block", $(l).html(m(n.markers[t.value].options[n.timeAttribute], n))) : console.error("Time property " + n.timeAttribute + " not found in data");
                    var a, s = [];
                    for (a = n.minValue; a <= n.maxValue; a++) n.markers[a] && r.removeLayer(n.markers[a]);
                    if (n.range)
                        for (a = t.values[0]; a <= t.values[1]; a++) n.markers[a] && (s.push(n.markers[a]), r.addLayer(n.markers[a]), i.addLayer(n.markers[a]));
                    else if (0 < n.follow)
                        for (a = t.value - n.follow + 1; a <= t.value; a++) n.markers[a] && (s.push(n.markers[a]), r.addLayer(n.markers[a]), i.addLayer(n.markers[a]));
                    else if (n.sameDate) {
                        var o;
                        for (o = void 0 !== n.markers[t.value].feature ? n.markers[t.value].feature.properties.time : n.markers[t.value].options.time, a = n.minValue; a <= n.maxValue; a++) n.markers[a].options.time == o && (s.push(n.markers[a]), r.addLayer(n.markers[a]))
                    } else
                        for (a = n.minValue; a <= t.value; a++) n.markers[a] && (s.push(n.markers[a]), r.addLayer(n.markers[a]), i.addLayer(n.markers[a]));
                    u.fire("rangechanged", {
                        markers: s
                    })
                }
                n.rezoom && r.fitBounds(i.getBounds(), {
                    maxZoom: n.rezoom
                })
            }
        }), n.alwaysShowDate && (l.style.display = "block", void 0 !== n.markers[e].feature ? n.markers[e].feature.properties[n.timeAttribute] ? n.markers[e] && (l.style.display = "block", $(l).html(m(n.markers[e].feature.properties[n.timeAttribute], n))) : console.error("Time property " + n.timeAttribute + " not found in data") : n.markers[e].options[n.timeAttribute] ? n.markers[e] && (l.style.display = "block", $(l).html(m(n.markers[e].options[n.timeAttribute], n))) : console.error("Time property " + n.timeAttribute + " not found in data"));
        var t = [];
        for (i = n.minValue; i <= e; i++) t.push(n.markers[i]), n.map.addLayer(n.markers[i]);
        this.fire("rangechanged", {
            markers: t
        })
    },
    clearTimestamp: function() {
        this.options.alwaysShowDate || (this.timestampContainer.innerHTML = "", this.timestampContainer.style.display = "none")
    },
    extractTimestamp: function(e, t) {
        return t.isEpoch && (e = new Date(parseInt(e)).toString()), e.substr(t.startTimeIdx, t.startTimeIdx + t.timeStrLength)
    },
    setPosition: function(e) {
        var t = this._map;
        return t && t.removeControl(this), this.options.position = e, t && t.addControl(this), this.startSlider(), this
    }
}), L.control.sliderControl = function(e) {
    return new L.Control.SliderControl(e)
};
