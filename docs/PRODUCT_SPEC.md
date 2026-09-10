# MuscleMap — Personal Workout & Muscle Tracking App

> Status: Authoritative V1 product specification, captured from the user on 2026-09-09. Preserve the intent and ask before materially simplifying or removing requirements.

I want you to build a mobile-first personal fitness tracking web app/PWA.

The app is primarily for my own use. The main goal is to make workout logging extremely fast while visually showing which muscles I have trained today and over longer periods.

Please treat the following as the V1 product specification. Before making major product changes or simplifying requirements, ask me rather than silently removing features.

## 1. Core concept

The app should convert completed workouts/exercises into muscle-training data and visualize the accumulated training stimulus on a front/back human muscle map.

I want to be able to view:

* Today
* This week
* Eventually month/history views

The muscle map should visually distinguish muscles that received little, moderate, or high training stimulus.

This should NOT simply be based on workout duration. Different exercises train different muscles at different levels.

Each exercise should have:

* Primary muscles
* Secondary muscles
* Relative muscle contribution/weighting
* Exercise type
* Duration and/or sets/reps where appropriate
* Resistance/load where appropriate

The underlying data model should be designed so the muscle-scoring algorithm can be improved later without rebuilding the app.

---

## 2. Workout Sets

A major way I exercise is by following YouTube or Bilibili workout videos.

I want reusable saved "Workout Sets."

Example:

growingannanas — 20 Min Arms + Shoulders

A Workout Set contains multiple individual exercises.

For example:

Workout
→ Lateral Raise
→ Shoulder Press
→ Biceps Curl
→ Triceps Extension
→ etc.

Each exercise must remain an independent exercise record inside the Workout Set.

Do NOT represent an entire video workout as only one generic workout record.

This is important because different exercises within the SAME workout may use different weights and train different muscles.

---

## 3. One-tap workout completion

After a Workout Set has been created, it should appear on the home screen under something like:

"My Workouts"

I want to be able to tap the workout and quickly mark it completed.

When I complete it, all exercises inside the Workout Set should be applied to today's workout log and muscle map.

The workflow should be approximately:

Tap Workout Set
→ Review exercises/weights
→ Complete Workout
→ All exercises are logged
→ Today's muscle map immediately updates

Do not make me manually log every exercise every time I repeat a saved Workout Set.

---

## 4. Per-exercise weights — VERY IMPORTANT

Weights must be stored PER EXERCISE, not per workout.

For example, within the same workout I may use:

Lateral Raise — 5 lb
Shoulder Press — 8 lb
Biceps Curl — 10 lb
Front Raise — 5 lb

The app must support this.

Each exercise in a Workout Set should have its own default/recent weight.

When I repeat the workout, the app should preselect the weight I used previously for that exercise.

I should be able to change individual exercise weights before completing the workout.

---

## 5. Weight selector UX

I do NOT want to type my weight manually every time.

For weighted exercises, show large tappable quick-select buttons such as:

Bodyweight | 2 lb | 3 lb | 5 lb | 8 lb | 10 lb | Custom

Only when I select "Custom" should a numeric input appear.

The selected weight should be visually obvious.

Default interpretation for dumbbell exercises:

"8 lb" means 8 lb PER DUMBBELL, not 8 lb total.

The UI can show:

8 lb
per dumbbell

The quick-weight options should eventually be configurable, but the initial defaults can be:

2, 3, 5, 8, 10 lb.

Remember the most recently used weight for each exercise/workout configuration.

---

## 6. Partial workout completion

Sometimes I do not finish an entire video.

When completing a Workout Set, allow:

100%
75%
50%
Custom

However, if technically reasonable, I would prefer exercise-level completion tracking rather than simply multiplying the whole workout by 50%.

For example, if I stopped halfway through a workout, I should eventually be able to indicate which exercises I actually completed.

Design the data model so this is possible.

---

## 7. Human muscle heat map

This is one of the most important parts of the app.

Show a front AND back human body/muscle illustration.

V1 muscle regions can include approximately:

* Chest
* Back
* Shoulders
* Biceps
* Triceps
* Core
* Glutes
* Quadriceps
* Hamstrings
* Calves

Different training stimulus levels should result in different visual intensities.

Example:

Shoulders — very high → darkest
Triceps — high
Biceps — high
Back — moderate
Chest — low

Do not simply use binary trained/not-trained coloring.

The visualization should support continuous or multiple levels of training intensity.

Architect the SVG/body map so individual muscle regions can later be subdivided into more detailed muscles, such as:

* Anterior/lateral/posterior deltoid
* Trapezius
* Latissimus dorsi
* Gluteus maximus/medius
* Rectus abdominis/obliques

---

## 8. Daily and weekly views

Home should prominently show today's muscle map.

I should also be able to switch to:

Today | Week

Weekly view should aggregate all completed exercises/workouts during that week.

Example weekly summary:

Shoulders █████
Glutes ████
Quads ████
Core ███
Back ██
Chest █

Also generate simple observations such as:

"Your training this week has been lower-body and shoulder dominant."

"Back training volume is relatively low this week."

These observations should initially be descriptive rather than medical recommendations.

---

## 9. Workout history

Store every completed workout session.

I should eventually be able to see:

* Date
* Workout Set
* Exercises completed
* Weight used for each exercise
* Duration
* Muscle stimulus
* Total weekly training
* Exercise progression over time

Example:

Lateral Raise

May — 3 lb
July — 5 lb
September — 8 lb

The data model needs to preserve historical weights. Changing my current/default weight must NOT modify old workout records.

---

## 10. Exercise library

Create an exercise data model/library.

An exercise should be capable of storing:

name
exercise type
equipment
primary muscles
secondary muscles
muscle contribution weights
default duration/reps/sets
resistance type

Resistance types should eventually support:

* Dumbbell
* Bodyweight
* Resistance band
* Machine
* Cardio
* Other

Do not assume every exercise uses dumbbells.

---

## 11. Video workout import — prepare architecture, don't overbuild V1

Eventually I want this workflow:

Paste YouTube or Bilibili URL
→ Analyze video
→ Identify exercises
→ Identify approximate timing
→ Map exercises to primary/secondary muscles
→ Generate Workout Set
→ Let user review/edit
→ Save to My Workouts

For example:

Paste a growingannanas workout URL.

The app might generate:

growingannanas — 20 Min Arms + Shoulders

Exercise 1
Exercise 2
Exercise 3
...

with muscle mappings.

IMPORTANT:

For V1, do NOT spend most of the project trying to build perfect automatic video recognition.

Instead:

1. Build the Workout Set architecture.
2. Allow Workout Sets and exercises to be manually created/edited.
3. Store an optional source video URL.
4. Design a clean future interface/API boundary for automatic video analysis.

Video-derived workouts must always be editable because automated exercise recognition may be incorrect.

---

## 12. Suggested navigation

Keep the app simple.

Suggested primary navigation:

TODAY

* Today's muscle map
* Today's completed workouts
* My Workouts
* Quick complete workout

WORKOUTS

* Saved Workout Sets
* Create Workout
* Edit Workout
* Eventually: Import from video

HISTORY

* Week summaries
* Previous workouts
* Muscle training history
* Exercise/weight progression

SETTINGS

* Quick weight buttons
* Units (lb/kg)
* Other preferences later

Do not add unnecessary social/community features.

This is currently a personal workout tracker, not a social fitness network.

---

## 13. UX principles

This is extremely important.

The app should minimize typing.

My normal daily workflow should take only a few taps.

For a previously saved Workout Set:

Open app
→ Tap workout
→ Adjust weights only if necessary
→ Complete
→ Done

Do not make me fill out a long workout form every day.

Use:

* Large touch targets
* Buttons/chips
* Sensible defaults
* Remembered previous values
* Mobile-first layouts

The design should feel clean, calm, modern, and fitness-oriented without becoming visually cluttered.

---

## 14. Technical direction

Start as a mobile-first web app/PWA rather than a native App Store application.

Priorities:

1. It works reliably.
2. Data persists.
3. It works well on iPhone.
4. Architecture is maintainable.
5. It can later support authentication/cloud sync if needed.
6. It can later support automated YouTube/Bilibili Workout Set generation.

For the initial personal version, local persistence is acceptable if that makes development significantly simpler, but structure the data layer so it can later migrate to a real database.

Choose a reasonable modern stack yourself and explain the choice briefly.

---

## 15. Important data-model distinction

Please maintain a distinction between:

ExerciseDefinition
WorkoutTemplate
WorkoutTemplateExercise
WorkoutSession
WorkoutSessionExercise

Conceptually:

ExerciseDefinition
= what a lateral raise IS

WorkoutTemplate
= what the saved "Anna 20 Min Arms" workout IS

WorkoutTemplateExercise
= lateral raise inside that particular workout, including its default configuration

WorkoutSession
= the workout I actually completed on September 9

WorkoutSessionExercise
= the lateral raise I actually performed that day, including the actual weight used

This distinction is important.

Historical workout data must be immutable enough that editing a Workout Template later does not rewrite previous Workout Sessions.

---

## 16. Muscle stimulus algorithm

For V1, use a simple transparent scoring system rather than pretending to calculate physiological muscle growth precisely.

For example, stimulus can be based on:

exercise muscle contribution
× duration/reps/sets
× resistance/intensity factor
× completion

Primary muscles should generally receive more stimulus than secondary muscles.

Keep this calculation in a separate module/service so we can change the formula later.

The UI should call this "training stimulus" or "training load", not claim that it measures actual muscle growth, calories burned, or fat loss.

---

## 17. First development milestone

Please do NOT attempt every future feature immediately.

First build a functional vertical slice containing:

1. Mobile home screen
2. Front/back muscle map
3. Saved Workout Sets
4. One example Workout Set
5. Multiple exercises within it
6. Per-exercise quick weight buttons
7. Custom weight option
8. Complete Workout
9. Save WorkoutSession + WorkoutSessionExercises
10. Immediately update today's muscle map
11. Weekly aggregation
12. Basic history
13. Ability to edit/create Workout Sets

Seed the app with this example:

Workout:
growingannanas — 20 Min Arms + Shoulders

Use placeholder/example exercises if the exact video exercise list is not available. Clearly label them as placeholder data rather than claiming they were extracted from the video.

Once this vertical slice works, show me the result and explain how to run/test it before expanding scope.

Please prioritize a working, polished core experience over adding many incomplete features.
