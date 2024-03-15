# Wheal Pell

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/aricooperdavis/wheal-pell/blob/main/LICENSE)

This repository contains the survey data and files for the Wheal Pell mine surveying project.

## Contents

- [About](#about)
- [Survey](#survey)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Survey

The survey has not been completed, but you can find the most recent `.3d` file in [the latest release](https://github.com/aricooperdavis/wheal-pell/releases/latest), or [view a 3D render online](https://aricooperdavis.github.io/wheal-pell/).

[![Screenshot of the 3D rendered survey data](image.png)](https://aricooperdavis.github.io/wheal-pell/)

## About

Wheal Pell is a mine in the St Agnes Consols set, in Cornwall. The workings are extensive and interesting, with a number of large open stopes, internal winzes, and shafts to the surface.

You can [see some 3D scans of areas of the mine on my blog](https://cooper-davis.net/blog/3d-scanning-abandoned-mines).

> :warning: Wheal Pell is on private land and __must not__ be accessed without the owners permission.

Producing a complete survey is a substantial undertaking, so this repo is used to document progress as it is made. Surveying is performed "paperless" using [SexyTopo](https://github.com/richsmith/sexytopo) to record data, and a [Shetland Attack Pony v5](https://www.shetlandattackpony.co.uk/) digital surveying tool to take measurements.

## Contributing

We're surveying using SexyTopo. If you want to contribute your own survey data then we'd recommend using SexyTopo too, because we know how it works. If you're happy with that, you can follow the instructions below:

- Start your survey from an existing station on the survey.
- Export your survey from SexyTopo using the "Therion" export format.
- Copy your exported data into the `Therion` directory in its own directory.
- In Therion's Map View, draw over your `.plan.th2` and `.ee.th2` files, `id`-ing any features (e.g. walls) that have to join with features in other survey scraps.
- In your `.th` file, detail your `team` and the `date`.
- In `Therion/pell.th`:
  - `input` your `.th` file in the `survey` section.
  - `join` your `id`-ed features in the `survey` section.
  - `equate` your stations in the `centerline` section.

We've also been saving our raw SexyTopo saves in the `SexyTopo` directory, in case we need them again for some reason.

## Credits

- Matt Palmer - _Notetaking_
- Ari Cooper-Davis - _Instruments_

## License

This project is licensed under the [MIT License](LICENSE).
