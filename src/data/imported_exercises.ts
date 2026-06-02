import { LibraryExercise, ExerciseDifficulty } from "../types";

export interface RawImportedExercise {
  id: number;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  secondaryMuscles?: string[];
  instructions: string[];
  gifUrl: string;
}

export const RAW_IMPORTED_DATA: RawImportedExercise[] = [
  {
    "id": 1,
    "name": "3/4 Sit-Up",
    "bodyPart": "Waist",
    "equipment": "Body Weight",
    "target": "Abs",
    "secondaryMuscles": [
      "Hip Flexors",
      "Lower Back"
    ],
    "instructions": [
      "Lie flat on your back with your knees bent and feet flat on the ground.",
      "Place your hands behind your head with your elbows pointing outwards.",
      "Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle.",
      "Pause for a moment at the top, then slowly lower your upper body back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1.gif"
  },
  {
    "id": 2,
    "name": "45° Side Bend",
    "bodyPart": "Waist",
    "equipment": "Body Weight",
    "target": "Abs",
    "secondaryMuscles": [
      "Obliques"
    ],
    "instructions": [
      "Stand with your feet shoulder-width apart and your arms extended straight down by your sides.",
      "Keeping your back straight and your core engaged, slowly bend your torso to one side, lowering your hand towards your knee.",
      "Pause for a moment at the bottom, then slowly return to the starting position.",
      "Repeat on the other side.",
      "Continue alternating sides for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/2.gif"
  },
  {
    "id": 3,
    "name": "Air Bike",
    "bodyPart": "Waist",
    "equipment": "Body Weight",
    "target": "Abs",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "instructions": [
      "Lie flat on your back with your hands placed behind your head.",
      "Lift your legs off the ground and bend your knees at a 90-degree angle.",
      "Bring your right elbow towards your left knee while simultaneously straightening your right leg.",
      "Return to the starting position and repeat the movement on the opposite side, bringing your left elbow towards your right knee while straightening your left leg.",
      "Continue alternating sides in a pedaling motion for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3.gif"
  },
  {
    "id": 1512,
    "name": "All Fours Squad Stretch",
    "bodyPart": "Upper Legs",
    "equipment": "Body Weight",
    "target": "Quads",
    "secondaryMuscles": [
      "Hamstrings",
      "Glutes"
    ],
    "instructions": [
      "Start on all fours with your hands directly under your shoulders and your knees directly under your hips.",
      "Extend one leg straight back, keeping your knee bent and your foot flexed.",
      "Slowly lower your hips towards the ground, feeling a stretch in your quads.",
      "Hold this position for 20-30 seconds.",
      "Switch legs and repeat the stretch on the other side."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1512.gif"
  },
  {
    "id": 6,
    "name": "Alternate Heel Touchers",
    "bodyPart": "Waist",
    "equipment": "Body Weight",
    "target": "Abs",
    "secondaryMuscles": [
      "Obliques"
    ],
    "instructions": [
      "Lie flat on your back with your knees bent and feet flat on the ground.",
      "Extend your arms straight out to the sides, parallel to the ground.",
      "Engaging your abs, lift your shoulders off the ground and reach your right hand towards your right heel.",
      "Return to the starting position and repeat on the left side, reaching your left hand towards your left heel.",
      "Continue alternating sides for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/6.gif"
  },
  {
    "id": 7,
    "name": "Alternate Lateral Pulldown",
    "bodyPart": "Back",
    "equipment": "Cable",
    "target": "Lats",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids"
    ],
    "instructions": [
      "Sit on the cable machine with your back straight and feet flat on the ground.",
      "Grasp the handles with an overhand grip, slightly wider than shoulder-width apart.",
      "Lean back slightly and pull the handles towards your chest, squeezing your shoulder blades together.",
      "Pause for a moment at the peak of the movement, then slowly release the handles back to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/7.gif"
  },
  {
    "id": 1368,
    "name": "Ankle Circles",
    "bodyPart": "Lower Legs",
    "equipment": "Body Weight",
    "target": "Calves",
    "secondaryMuscles": [
      "Ankle Stabilizers"
    ],
    "instructions": [
      "Sit on the ground with your legs extended in front of you.",
      "Lift one leg off the ground and rotate your ankle in a circular motion.",
      "Perform the desired number of circles in one direction, then switch to the other direction.",
      "Repeat with the other leg."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1368.gif"
  },
  {
    "id": 3293,
    "name": "Archer Pull Up",
    "bodyPart": "Back",
    "equipment": "Body Weight",
    "target": "Lats",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "instructions": [
      "Start by hanging from a pull-up bar with an overhand grip, slightly wider than shoulder-width apart.",
      "Engage your core and pull your shoulder blades down and back.",
      "As you pull yourself up, bend one arm and bring your elbow towards your side, while keeping the other arm straight.",
      "Continue pulling until your chin is above the bar and your bent arm is fully flexed.",
      "Lower yourself back down with control, straightening the bent arm and repeating the movement on the other side.",
      "Alternate sides with each repetition."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3293.gif"
  },
  {
    "id": 3294,
    "name": "Archer Push Up",
    "bodyPart": "Chest",
    "equipment": "Body Weight",
    "target": "Pectorals",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders",
      "Core"
    ],
    "instructions": [
      "Start in a push-up position with your hands slightly wider than shoulder-width apart.",
      "Extend one arm straight out to the side, parallel to the ground.",
      "Lower your body by bending your elbows, keeping your back straight and core engaged.",
      "Push back up to the starting position.",
      "Repeat on the other side, extending the opposite arm out to the side.",
      "Continue alternating sides for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3294.gif"
  },
  {
    "id": 2355,
    "name": "Arm Slingers Hanging Bent Knee Legs",
    "bodyPart": "Waist",
    "equipment": "Body Weight",
    "target": "Abs",
    "secondaryMuscles": [
      "Shoulders",
      "Back"
    ],
    "instructions": [
      "Hang from a pull-up bar with your arms fully extended and your knees bent at a 90-degree angle.",
      "Engage your core and lift your knees towards your chest, bringing them as close to your elbows as possible.",
      "Slowly lower your legs back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/2355.gif"
  },
  {
    "id": 2333,
    "name": "Arm Slingers Hanging Straight Legs",
    "bodyPart": "Waist",
    "equipment": "Body Weight",
    "target": "Abs",
    "secondaryMuscles": [
      "Shoulders",
      "Back"
    ],
    "instructions": [
      "Hang from a pull-up bar with your arms fully extended and your legs straight down.",
      "Engage your core and lift your legs up in front of you until they are parallel to the ground.",
      "Hold for a moment at the top, then slowly lower your legs back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/2333.gif"
  },
  {
    "id": 3214,
    "name": "Arms Apart Circular Toe Touch (Male)",
    "bodyPart": "Upper Legs",
    "equipment": "Body Weight",
    "target": "Glutes",
    "secondaryMuscles": [
      "Hamstrings",
      "Quadriceps",
      "Calves"
    ],
    "instructions": [
      "Stand with your feet shoulder-width apart and arms extended to the sides.",
      "Keeping your legs straight, bend forward at the waist and reach down towards your toes with your right hand.",
      "As you reach down, simultaneously lift your left leg straight up behind you, maintaining balance.",
      "Return to the starting position and repeat the movement with your left hand reaching towards your toes and your right leg lifting up behind you.",
      "Continue alternating sides for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3214.gif"
  },
  {
    "id": 3204,
    "name": "Arms Overhead Full Sit-Up (Male)",
    "bodyPart": "Waist",
    "equipment": "Body Weight",
    "target": "Abs",
    "secondaryMuscles": [
      "Hip Flexors",
      "Lower Back"
    ],
    "instructions": [
      "Lie flat on your back with your knees bent and feet flat on the ground.",
      "Extend your arms overhead, keeping them straight.",
      "Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is upright.",
      "Pause for a moment at the top, then slowly lower your upper body back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3204.gif"
  },
  {
    "id": 9,
    "name": "Assisted Chest Dip (Kneeling)",
    "bodyPart": "Chest",
    "equipment": "Leverage Machine",
    "target": "Pectorals",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "instructions": [
      "Adjust the machine to your desired height and secure your knees on the pad.",
      "Grasp the handles with your palms facing down and your arms fully extended.",
      "Lower your body by bending your elbows until your upper arms are parallel to the floor.",
      "Pause for a moment, then push yourself back up to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/9.gif"
  },
  {
    "id": 11,
    "name": "Assisted Hanging Knee Raise",
    "bodyPart": "Waist",
    "equipment": "Assisted",
    "target": "Abs",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "instructions": [
      "Hang from a pull-up bar with your arms fully extended and your palms facing away from you.",
      "Engage your core muscles and lift your knees towards your chest, bending at the hips and knees.",
      "Pause for a moment at the top of the movement, squeezing your abs.",
      "Slowly lower your legs back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/11.gif"
  },
  {
    "id": 10,
    "name": "Assisted Hanging Knee Raise With Throw Down",
    "bodyPart": "Waist",
    "equipment": "Assisted",
    "target": "Abs",
    "secondaryMuscles": [
      "Hip Flexors",
      "Lower Back"
    ],
    "instructions": [
      "Hang from a pull-up bar with your arms fully extended and your palms facing away from you.",
      "Engage your core and lift your knees towards your chest, keeping your legs together.",
      "Once your knees are at chest level, explosively throw your legs down towards the ground, extending them fully.",
      "Allow your legs to swing back up and repeat the movement for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/10.gif"
  },
  {
    "id": 1708,
    "name": "Assisted Lying Calves Stretch",
    "bodyPart": "Lower Legs",
    "equipment": "Assisted",
    "target": "Calves",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "instructions": [
      "Lie on your back with your legs extended.",
      "Bend one knee and place your foot flat on the ground.",
      "Using your hands or a towel, gently pull your toes towards your body, feeling a stretch in your calf.",
      "Hold the stretch for 20-30 seconds.",
      "Release the stretch and repeat on the other leg."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1708.gif"
  },
  {
    "id": 1709,
    "name": "Assisted Lying Glutes Stretch",
    "bodyPart": "Upper Legs",
    "equipment": "Assisted",
    "target": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "instructions": [
      "Lie on your back with your legs extended.",
      "Bend your right knee and place your right ankle on your left thigh, just above the knee.",
      "Grasp your left thigh with both hands and gently pull it towards your chest.",
      "Hold the stretch for 20-30 seconds.",
      "Release and repeat on the other side."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1709.gif"
  },
  {
    "id": 1710,
    "name": "Assisted Lying Gluteus And Piriformis Stretch",
    "bodyPart": "Upper Legs",
    "equipment": "Assisted",
    "target": "Glutes",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "instructions": [
      "Lie on your back with your legs extended.",
      "Bend your right knee and place your right ankle on your left thigh, just above the knee.",
      "Grasp your left thigh with both hands and gently pull it towards your chest.",
      "Hold the stretch for 20-30 seconds.",
      "Release the stretch and repeat on the other side."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1710.gif"
  },
  {
    "id": 12,
    "name": "Assisted Lying Leg Raise With Lateral Throw Down",
    "bodyPart": "Waist",
    "equipment": "Assisted",
    "target": "Abs",
    "secondaryMuscles": [
      "Hip Flexors",
      "Obliques"
    ],
    "instructions": [
      "Lie flat on your back with your legs extended and your arms by your sides.",
      "Place your hands under your glutes for support.",
      "Engage your abs and lift your legs off the ground, keeping them straight.",
      "While keeping your legs together, lower them to one side until they are a few inches above the ground.",
      "Pause for a moment, then lift your legs back to the starting position.",
      "Repeat the movement to the other side.",
      "Continue alternating sides for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/12.gif"
  },
  {
    "id": 13,
    "name": "Assisted Lying Leg Raise With Throw Down",
    "bodyPart": "Waist",
    "equipment": "Assisted",
    "target": "Abs",
    "secondaryMuscles": [
      "Hip Flexors",
      "Quadriceps"
    ],
    "instructions": [
      "Lie flat on your back with your legs extended and your arms by your sides.",
      "Place your hands under your glutes for support.",
      "Engage your core and lift your legs off the ground, keeping them straight.",
      "Raise your legs until they are perpendicular to the ground.",
      "Lower your legs back down to the starting position.",
      "Simultaneously, throw your legs down towards the ground, keeping them straight.",
      "Raise your legs back up to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/13.gif"
  },
  {
    "id": 14,
    "name": "Assisted Motion Russian Twist",
    "bodyPart": "Waist",
    "equipment": "Medicine Ball",
    "target": "Abs",
    "secondaryMuscles": [
      "Obliques",
      "Lower Back"
    ],
    "instructions": [
      "Sit on the ground with your knees bent and feet flat on the floor.",
      "Hold the medicine ball with both hands in front of your chest.",
      "Lean back slightly, engaging your abs and keeping your back straight.",
      "Slowly twist your torso to the right, bringing the medicine ball towards the right side of your body.",
      "Pause for a moment, then twist your torso to the left, bringing the medicine ball towards the left side of your body.",
      "Continue alternating sides for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/14.gif"
  },
  {
    "id": 15,
    "name": "Assisted Parallel Close Grip Pull-Up",
    "bodyPart": "Back",
    "equipment": "Leverage Machine",
    "target": "Lats",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "instructions": [
      "Adjust the machine to your desired weight and height.",
      "Place your hands on the parallel bars with a close grip, palms facing each other.",
      "Hang from the bars with your arms fully extended and your feet off the ground.",
      "Engage your back muscles and pull your body up towards the bars, keeping your elbows close to your body.",
      "Continue pulling until your chin is above the bars.",
      "Pause for a moment at the top, then slowly lower your body back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/15.gif"
  },
  {
    "id": 16,
    "name": "Assisted Prone Hamstring",
    "bodyPart": "Upper Legs",
    "equipment": "Assisted",
    "target": "Hamstrings",
    "secondaryMuscles": [
      "Glutes",
      "Lower Back"
    ],
    "instructions": [
      "Lie face down on a mat or bench with your legs fully extended.",
      "Have a partner or use a resistance band to secure your ankles.",
      "Engage your hamstrings and lift your legs towards your glutes, keeping your knees straight.",
      "Pause for a moment at the top, then slowly lower your legs back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/16.gif"
  },
  {
    "id": 1713,
    "name": "Assisted Prone Lying Quads Stretch",
    "bodyPart": "Upper Legs",
    "equipment": "Assisted",
    "target": "Quads",
    "secondaryMuscles": [
      "Hamstrings",
      "Glutes"
    ],
    "instructions": [
      "Lie face down on the ground with your legs extended.",
      "Bend your left knee and reach back with your left hand to grab your left foot or ankle.",
      "Gently pull your left foot towards your glutes, feeling a stretch in your left quad.",
      "Hold the stretch for 20-30 seconds, then release.",
      "Repeat with your right leg."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1713.gif"
  },
  {
    "id": 1714,
    "name": "Assisted Prone Rectus Femoris Stretch",
    "bodyPart": "Waist",
    "equipment": "Assisted",
    "target": "Abs",
    "secondaryMuscles": [
      "Quadriceps"
    ],
    "instructions": [
      "Lie face down on the ground with your legs straight.",
      "Bend your right knee and reach back with your right hand to grab your right foot or ankle.",
      "Gently pull your right foot or ankle towards your glutes, feeling a stretch in the front of your right thigh.",
      "Hold the stretch for 20-30 seconds.",
      "Release and repeat on the other side."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1714.gif"
  },
  {
    "id": 17,
    "name": "Assisted Pull-Up",
    "bodyPart": "Back",
    "equipment": "Leverage Machine",
    "target": "Lats",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "instructions": [
      "Adjust the machine to your desired weight and height settings.",
      "Grasp the handles with an overhand grip, slightly wider than shoulder-width apart.",
      "Hang with your arms fully extended and your feet off the ground.",
      "Engage your back muscles and pull your body up towards the handles, keeping your elbows close to your body.",
      "Continue pulling until your chin is above the handles.",
      "Pause for a moment at the top, then slowly lower your body back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/17.gif"
  },
  {
    "id": 1716,
    "name": "Assisted Seated Pectoralis Major Stretch With Stability Ball",
    "bodyPart": "Chest",
    "equipment": "Assisted",
    "target": "Pectorals",
    "secondaryMuscles": [
      "Shoulders",
      "Triceps"
    ],
    "instructions": [
      "Sit on a stability ball with your feet flat on the ground and your back straight.",
      "Hold a stability ball with both hands and extend your arms straight out in front of you.",
      "Slowly lower the stability ball towards your chest, feeling a stretch in your pectoral muscles.",
      "Hold the stretch for a few seconds, then slowly return to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1716.gif"
  },
  {
    "id": 1712,
    "name": "Assisted Side Lying Adductor Stretch",
    "bodyPart": "Upper Legs",
    "equipment": "Assisted",
    "target": "Adductors",
    "secondaryMuscles": [
      "Hamstrings",
      "Glutes"
    ],
    "instructions": [
      "Lie on your side with your legs straight and stacked on top of each other.",
      "Bend your bottom leg slightly for stability.",
      "Place your top foot on a stable surface, such as a bench or step.",
      "Keeping your top leg straight, slowly lower it towards the ground, feeling a stretch in your inner thigh.",
      "Hold the stretch for 20-30 seconds.",
      "Return to the starting position and repeat on the other side."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1712.gif"
  },
  {
    "id": 1758,
    "name": "Assisted Sit-Up",
    "bodyPart": "Waist",
    "equipment": "Assisted",
    "target": "Abs",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "instructions": [
      "Sit on the edge of a bench or have someone hold your feet down.",
      "Lie flat on your back with your knees bent and feet flat on the ground.",
      "Place your hands behind your head with your elbows pointing outwards.",
      "Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle.",
      "Pause for a moment at the top, then slowly lower your upper body back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1758.gif"
  },
  {
    "id": 1431,
    "name": "Assisted Standing Chin-Up",
    "bodyPart": "Back",
    "equipment": "Leverage Machine",
    "target": "Lats",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "instructions": [
      "Adjust the machine to your desired assistance level.",
      "Stand on the foot platform and grip the handles with an overhand grip, slightly wider than shoulder-width apart.",
      "Keep your chest up and shoulders back, engage your core, and slightly bend your knees.",
      "Pull your body up by flexing your elbows and driving your elbows down towards your sides.",
      "Continue pulling until your chin is above the bar.",
      "Pause for a moment at the top, then slowly lower your body back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1431.gif"
  },
  {
    "id": 1432,
    "name": "Assisted Standing Pull-Up",
    "bodyPart": "Back",
    "equipment": "Leverage Machine",
    "target": "Lats",
    "secondaryMuscles": [
      "Biceps",
      "Forearms"
    ],
    "instructions": [
      "Adjust the machine to your desired weight and height settings.",
      "Stand facing the machine with your feet shoulder-width apart.",
      "Grasp the handles with an overhand grip, slightly wider than shoulder-width apart.",
      "Engage your lats and biceps, and pull yourself up towards the handles.",
      "Pause for a moment at the top, squeezing your back muscles.",
      "Slowly lower yourself back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1432.gif"
  },
  {
    "id": 18,
    "name": "Assisted Standing Triceps Extension (With Towel)",
    "bodyPart": "Upper Arms",
    "equipment": "Assisted",
    "target": "Triceps",
    "secondaryMuscles": [
      "Shoulders"
    ],
    "instructions": [
      "Stand with your feet shoulder-width apart and hold a towel with both hands behind your head.",
      "Keep your elbows close to your ears and your upper arms stationary.",
      "Slowly extend your forearms upward, squeezing your triceps at the top.",
      "Pause for a moment, then slowly lower the towel back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/18.gif"
  },
  {
    "id": 19,
    "name": "Assisted Triceps Dip (Kneeling)",
    "bodyPart": "Upper Arms",
    "equipment": "Leverage Machine",
    "target": "Triceps",
    "secondaryMuscles": [
      "Chest",
      "Shoulders"
    ],
    "instructions": [
      "Adjust the machine to your desired weight and height.",
      "Kneel down on the pad facing the machine, with your hands gripping the handles.",
      "Lower your body by bending your elbows, keeping your back straight and close to the machine.",
      "Pause for a moment at the bottom, then push yourself back up to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/19.gif"
  },
  {
    "id": 2364,
    "name": "Assisted Wide-Grip Chest Dip (Kneeling)",
    "bodyPart": "Chest",
    "equipment": "Leverage Machine",
    "target": "Pectorals",
    "secondaryMuscles": [
      "Triceps",
      "Shoulders"
    ],
    "instructions": [
      "Adjust the machine to your desired height and secure your knees on the pad.",
      "Grasp the handles with a wide grip and keep your elbows slightly bent.",
      "Lower your body by bending your elbows until your upper arms are parallel to the floor.",
      "Push yourself back up to the starting position by extending your arms.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/2364.gif"
  },
  {
    "id": 3220,
    "name": "Astride Jumps (Male)",
    "bodyPart": "Cardio",
    "equipment": "Body Weight",
    "target": "Cardiovascular System",
    "secondaryMuscles": [
      "Quadriceps",
      "Hamstrings",
      "Calves"
    ],
    "instructions": [
      "Stand with your feet shoulder-width apart.",
      "Bend your knees and lower your body into a squat position.",
      "Jump explosively upwards, extending your legs and arms.",
      "While in the air, spread your legs apart and bring your arms out to the sides.",
      "Land softly with your feet shoulder-width apart, bending your knees to absorb the impact.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3220.gif"
  },
  {
    "id": 3672,
    "name": "Back And Forth Step",
    "bodyPart": "Cardio",
    "equipment": "Body Weight",
    "target": "Cardiovascular System",
    "secondaryMuscles": [
      "Quadriceps",
      "Hamstrings",
      "Glutes",
      "Calves"
    ],
    "instructions": [
      "Stand with your feet shoulder-width apart.",
      "Step forward with your right foot, bending your knee and lowering your body into a lunge position.",
      "Push off with your right foot and step back to the starting position.",
      "Repeat the movement with your left foot, alternating legs with each step.",
      "Continue stepping back and forth, maintaining a steady pace.",
      "Repeat for the desired duration or number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3672.gif"
  },
  {
    "id": 1314,
    "name": "Back Extension On Exercise Ball",
    "bodyPart": "Back",
    "equipment": "Stability Ball",
    "target": "Spine",
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings"
    ],
    "instructions": [
      "Place the stability ball on the ground and lie face down on top of it, with your hips resting on the ball and your feet against a wall or other stable surface.",
      "Position your hands behind your head or crossed over your chest.",
      "Engage your core and slowly lift your upper body off the ball, extending your back until your body forms a straight line from your head to your heels.",
      "Pause for a moment at the top, then slowly lower your upper body back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1314.gif"
  },
  {
    "id": 3297,
    "name": "Back Lever",
    "bodyPart": "Back",
    "equipment": "Body Weight",
    "target": "Upper Back",
    "secondaryMuscles": [
      "Biceps",
      "Forearms",
      "Core"
    ],
    "instructions": [
      "Start by hanging from a pull-up bar with an overhand grip, hands slightly wider than shoulder-width apart.",
      "Engage your core and pull your shoulder blades down and back.",
      "Bend your knees and tuck them towards your chest.",
      "Slowly lift your legs up, keeping them straight, until your body is parallel to the ground.",
      "Hold this position for a few seconds, then slowly lower your legs back down to the starting position.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3297.gif"
  },
  {
    "id": 1405,
    "name": "Back Pec Stretch",
    "bodyPart": "Back",
    "equipment": "Body Weight",
    "target": "Lats",
    "secondaryMuscles": [
      "Shoulders",
      "Chest"
    ],
    "instructions": [
      "Stand tall with your feet shoulder-width apart.",
      "Extend your arms straight out in front of you, parallel to the ground.",
      "Cross your arms in front of your body, with your right arm over your left arm.",
      "Interlock your fingers and rotate your palms away from your body.",
      "Slowly raise your arms up and away from your body, feeling a stretch in your back and chest.",
      "Hold the stretch for 15-30 seconds, then release.",
      "Repeat on the opposite side."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1405.gif"
  },
  {
    "id": 1473,
    "name": "Backward Join",
    "bodyPart": "Upper Legs",
    "equipment": "Body Weight",
    "target": "Quads",
    "secondaryMuscles": [
      "Hamstrings",
      "Glutes",
      "Calves"
    ],
    "instructions": [
      "Stand with your feet shoulder-width apart.",
      "Bend your knees slightly and jump backwards, pushing off with both feet.",
      "Land softly on the balls of your feet, bending your knees to absorb the impact.",
      "Repeat for the desired number of repetitions."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1473.gif"
  },
  {
    "id": 20,
    "name": "Balance Board",
    "bodyPart": "Upper Legs",
    "equipment": "Body Weight",
    "target": "Quads",
    "secondaryMuscles": [
      "Calves",
      "Hamstrings",
      "Glutes"
    ],
    "instructions": [
      "Place the balance board on a flat surface.",
      "Step onto the balance board with one foot, ensuring it is centered.",
      "Slowly shift your weight onto the foot on the balance board, keeping your core engaged.",
      "Maintain your balance and stability as you hold the position for a desired amount of time.",
      "Repeat the exercise with the other foot."
    ],
    "gifUrl": "https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/20.gif"
  }
];

export function mapRawImported(raw: RawImportedExercise): Omit<LibraryExercise, "id" | "createdAt"> {
  const normBodyPart = raw.bodyPart?.toLowerCase() || "";
  const normTarget = raw.target?.toLowerCase() || "";
  const normEquipment = raw.equipment?.toLowerCase() || "";

  // 1. Muscle group mapping
  let muscleGroup = "Quadríceps";
  if (normBodyPart === "waist" || normTarget.includes("abs") || normTarget.includes("oblique") || normTarget.includes("abdomen")) {
    muscleGroup = "Abdômen";
  } else if (normBodyPart === "back" || normTarget.includes("lat") || normTarget.includes("row") || normTarget.includes("spine")) {
    muscleGroup = "Costas";
  } else if (normBodyPart === "chest" || normTarget.includes("pectoral") || normTarget.includes("serratus")) {
    muscleGroup = "Peitoral";
  } else if (normBodyPart === "shoulders" || normTarget.includes("delt")) {
    muscleGroup = "Ombros";
  } else if (normBodyPart === "upper arms" || normBodyPart === "lower arms") {
    if (normTarget.includes("tricep")) {
      muscleGroup = "Tríceps";
    } else {
      muscleGroup = "Bíceps";
    }
  } else if (normBodyPart === "cardio" || normTarget.includes("cardio")) {
    muscleGroup = "Cardio";
  } else if (normBodyPart === "lower legs" || normTarget.includes("calf") || normTarget.includes("calves")) {
    muscleGroup = "Panturrilhas";
  } else if (normBodyPart === "upper legs") {
    if (normTarget.includes("hamstring") || normTarget.includes("posterior")) {
      muscleGroup = "Posterior";
    } else if (normTarget.includes("glute")) {
      muscleGroup = "Glúteo";
    } else if (normTarget.includes("quad")) {
      muscleGroup = "Quadríceps";
    } else {
      muscleGroup = "Quadríceps";
    }
  } else if (normBodyPart === "neck") {
    muscleGroup = "Ombros";
  }

  // 2. Equipment mapping
  let equipment = "Peso do Corpo";
  if (normEquipment.includes("dumb") || normEquipment === "weighted") {
    equipment = "Halteres";
  } else if (normEquipment.includes("bar") || normEquipment.includes("olympic")) {
    equipment = "Barra";
  } else if (normEquipment.includes("cable") || normEquipment.includes("pulley")) {
    equipment = "Polia";
  } else if (normEquipment.includes("band") || normEquipment.includes("elastic")) {
    equipment = "Elástico";
  } else if (normEquipment.includes("kettlebell")) {
    equipment = "Kettlebell";
  } else if (normEquipment.includes("machine") || normEquipment.includes("sled") || normEquipment.includes("assisted") || normEquipment.includes("cycle") || normEquipment.includes("ergometer") || normEquipment.includes("stepmill") || normEquipment.includes("treadmill")) {
    equipment = "Máquina";
  } else if (normEquipment.includes("body weight") || normEquipment.includes("bodyweight") || normEquipment.includes("assisted")) {
    equipment = "Peso do Corpo";
  } else {
    // Default fallback for ball, roller, rope etc.
    equipment = "Peso do Corpo";
  }

  // 3. Difficulty determination (can rotate or pick a default)
  let difficulty: ExerciseDifficulty = "Iniciante";
  if (raw.name.toLowerCase().includes("assisted") || raw.name.toLowerCase().includes("circles") || raw.name.toLowerCase().includes("stretch")) {
    difficulty = "Iniciante";
  } else if (raw.name.toLowerCase().includes("windmill") || raw.name.toLowerCase().includes("lever") || raw.name.toLowerCase().includes("handstand") || raw.name.toLowerCase().includes("planche") || raw.name.toLowerCase().includes("olympic")) {
    difficulty = "Avançado";
  } else {
    difficulty = "Intermediário";
  }

  // Description from instructions list
  const description = raw.instructions && raw.instructions.length > 0 
    ? raw.instructions.join(" ") 
    : "Execute o movimento de forma limpa, mantendo a postura firme e cadenciada.";

  return {
    name: raw.name,
    muscleGroup,
    equipment,
    difficulty,
    videoUrl: raw.gifUrl, // Use the gifUrl as videoUrl or both
    gifUrl: raw.gifUrl,
    description
  };
}
