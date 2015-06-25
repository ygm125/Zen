(function() {
    "use strict";
    function $$point$$Point(x, y) {
      this.x = x;
      this.y = y;
      this.c =123;
    }
    function $$segment$$Segment(start, end) {
      this.start = start;
      this.end = end;

      this.distance = Math.sqrt(
        Math.pow(start.x - end.x, 2) +
        Math.pow(start.y - end.y, 2)
      );
    }

    var page$index$index$$start = new $$point$$Point(0, 0);
    var page$index$index$$end = new $$segment$$Segment(4, 5);
}).call(this);