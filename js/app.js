/** @class App.Ctrl */
atom.declare('App.Ctrl', {
    ball: null,

    initialize: function () {
        atom.ImagePreloader.run({
            'ball': 'images/elems.png [20:0:26:26]'
        }, this.start.bind(this));
    },

    start: function (images) {
        this.size = new Size(800, 500);
        this.app = new App({
            size: this.size,
            simple: true
        });
        this.layer = this.app.createLayer({
            invoke: true
        });
        this.app.resources.set('images', images);

        this.ball = new App.Ball(this.layer, {
            controller: this,
            size: this.size,
            controls: {
                up: 'w',
                down: 's',
                left: 'a',
                right: 'd'
            }
        });
    }
});

/** @class App.Ball */
atom.declare('App.Ball', App.Element, {
        speedUp: function () {
            return new Point(0, this.speedDownValue)
        },
        speedRight: function () {
            return new Point(this.speedLeftValue, 0)
        },
        speedDownValue: 0,
        speedLeftValue: 0,
        speedChangeValue: 1,
        decreseSpeed: function (speedValue) {
            if (speedValue > 0) {
                return speedValue - this.speedChangeValue;
            }
            else if (speedValue < 0) {
                return speedValue + this.speedChangeValue;
            }
            return speedValue;
        },
        get size() {
            return this.settings.get('size');
        },
        configure: function () {
            this.shape = new Circle(new Point(this.size).mul(0.5), 15);
        },
        move: function (time) {
            this.shape.center.move(this.speedUp().clone().mul(time / 1000));
            this.shape.center.move(this.speedRight().clone().mul(time / 1000));
        },
        onUpdate: function (time) {
            var
                keyboard = atom.Keyboard(),
                controls = this.settings.get('controls'),
                isDown = keyboard.key(controls.down),
                isRight = keyboard.key(controls.right);

            if (isDown || keyboard.key(controls.up) || isRight || keyboard.key(controls.left)) {
                if (isDown || keyboard.key(controls.up)) {
                    if (isDown) {
                        this.speedDownValue += this.speedChangeValue*2;
                    }
                    else {
                        this.speedDownValue -= this.speedChangeValue*2;
                    }
                }
                if (isRight || keyboard.key(controls.left)) {
                    if (isRight) {
                        this.speedLeftValue += this.speedChangeValue*2;
                    }
                    else {
                        this.speedLeftValue -= this.speedChangeValue*2;
                    }
                }
            }
            this.speedLeftValue = this.decreseSpeed(this.speedLeftValue);
            this.speedDownValue = this.decreseSpeed(this.speedDownValue);
            this.move(time);
            this.redraw();
        },
        renderTo: function (ctx, resources) {
            ctx.drawImage({
                image: resources.get('images').get('ball'),
                center: this.shape.center
                //draw : this.shape,
                //optimize: true
            })
        }
    }
)
;