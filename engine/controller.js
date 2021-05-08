export default function Controller(model, view) {


    view.KeyPress((action) => {

        if (model.getState() == 1) {

            switch(action.direction) {
                case 'up':
                    model.move("up");
                    break;
                case 'right':
                    model.move("right");
                    break;
                case 'down':
                    model.move("down");
                    break;
                case 'left':
                    model.move("left");
                    break;
                case 'hard':
                    model.hardDrop();
                    break;
            }
        }
    });



    this.start = function() {

        setTimeout(function run() {
            if (model.getState()) {
                model.move("down");
            } else {
                clearInterval();
            }
            setTimeout(run, model.getSpeed() * 1000);
        }, model.getSpeed() * 1000);


    }

    model.onStart((state) => {
        if (state == 2) {
            this.start();
        }
    });


}