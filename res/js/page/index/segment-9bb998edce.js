(function() {
    "use strict";
    function page$index$segment$$Segment(start, end) {
      this.start = start;
      this.end = end;

      this.distance = Math.sqrt(
        Math.pow(start.x - end.x, 2) +
        Math.pow(start.y - end.y, 2)
      );
    }
}).call(this);